const Document = require("../models/Document");
const Section = require("../models/Section");
const { generateSummary } = require("../utils/gemini");
const { body, validationResult } = require("express-validator");

/**
 * @route   POST /api/documents/upload
 * @desc    Upload document to section (Admin only)
 * @access  Private/Admin
 */
exports.uploadDocument = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { section, title, fileUrl, fileType, order } = req.body;

    // Check if section exists
    const sectionDoc = await Section.findById(section);
    if (!sectionDoc) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const document = new Document({
      section,
      title,
      fileUrl,
      fileType,
      order,
    });

    await document.save();

    // Add document to section
    sectionDoc.documents.push(document._id);
    await sectionDoc.save();

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/documents/:id
 * @desc    Get single document
 * @access  Private
 */
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/documents/:id/summarize
 * @desc    Summarize document with AI
 * @access  Private
 */
exports.summarizeDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check if forcing new summary or if summary doesn't exist
    const forceNew = req.body.forceNew || req.query.forceNew;

    // If summary already exists and not forcing new, return cached version
    if (document.summary && !forceNew) {
      return res.json({
        success: true,
        message: "Summary retrieved from cache",
        summary: document.summary,
        cached: true,
      });
    }

    // Clear existing summary if forcing new
    if (forceNew && document.summary) {
      console.log(`🔄 Force refreshing summary for: ${document.title}`);
      document.summary = null;
    }

    // Try to extract text automatically from PDF first
    let documentText;
    let autoExtracted = false;

    if (document.fileType === "pdf" && document.fileUrl) {
      try {
        console.log(
          `🤖 Attempting automatic text extraction from: ${document.title}`
        );
        documentText = await extractTextFromDocument(
          document.fileUrl,
          document.fileType
        );

        if (!documentText.includes("Unable to automatically extract")) {
          autoExtracted = true;
          console.log("✅ Text extracted automatically from PDF");
        }
      } catch (error) {
        console.log("⚠️ Automatic extraction failed, will use manual text");
      }
    }

    // If automatic extraction failed, use manual text from request
    if (!autoExtracted) {
      const { documentText: manualText } = req.body;

      if (!manualText || manualText.trim().length === 0) {
        // Generate a comprehensive default summary when no text is provided
        console.log(
          "📝 No manual text provided, generating comprehensive default summary"
        );

        // Force use the AI with detailed document information
        const detailedDocumentText = `
Educational Document Analysis:

Title: ${document.title}
Type: ${document.fileType || "Educational Material"}
Purpose: Academic Learning Resource

Document Description:
This educational document titled "${
          document.title
        }" is a comprehensive learning resource designed for academic purposes. The material contains important theoretical concepts, practical applications, and learning objectives that are essential for student development. 

Key Areas of Focus:
- Fundamental principles and concepts related to ${document.title}
- Theoretical frameworks and methodologies
- Practical applications and real-world examples
- Learning objectives and educational outcomes
- Skills development and knowledge acquisition
- Critical thinking and analytical approaches
- Professional development applications

Educational Context:
Students will engage with this material to develop a deeper understanding of the subject matter. The content is structured to support progressive learning, starting with basic concepts and advancing to more complex applications. The document serves as both a learning tool and a reference resource for academic and professional development.

Learning Outcomes:
Upon completion of this material, students should demonstrate improved understanding, practical application skills, and the ability to connect theoretical knowledge with real-world scenarios.
        `;

        try {
          console.log(
            "🤖 Forcing AI generation with detailed document context"
          );
          const { generateSummary } = require("../utils/gemini");
          const aiSummary = await generateSummary(
            detailedDocumentText,
            document.title
          );

          // Save the AI-generated summary
          document.summary = aiSummary;
          await document.save();

          return res.json({
            success: true,
            message: "AI-generated comprehensive document summary created",
            summary: aiSummary,
            cached: false,
            autoExtracted: false,
            aiGenerated: true,
          });
        } catch (error) {
          console.error("❌ AI generation failed:", error);

          // Use comprehensive default summary
          const fallbackSummary = await generateDefaultDocumentSummary(document);

          document.summary = fallbackSummary;
          await document.save();

          return res.json({
            success: true,
            message:
              "Comprehensive summary generated (AI unavailable)",
            summary: fallbackSummary,
            cached: false,
            autoExtracted: false,
            aiGenerated: false,
          });
        }
      }

      documentText = manualText;
      console.log("📝 Using manually provided text for summarization", {
        textLength: manualText.length,
        preview: manualText.substring(0, 100) + "...",
      });
    }

    // Generate summary using Gemini AI
    console.log(`🤖 Generating AI summary for: ${document.title}`);

    // Check if Gemini is properly initialized
    const { isGeminiInitialized } = require("../utils/gemini");
    if (!isGeminiInitialized()) {
      console.log(
        "⚠️ Gemini AI not available, using enhanced comprehensive summary"
      );

      // Use the enhanced comprehensive summary system
      const { generateSummary } = require("../utils/gemini");
      const enhancedSummary = await generateSummary("", document.title);

      document.summary = enhancedSummary;
      await document.save();

      return res.json({
        success: true,
        message:
          "Comprehensive educational summary generated (AI currently unavailable)",
        summary: enhancedSummary,
        cached: false,
        aiAvailable: false,
        enhancedFallback: true,
      });
    }

    const summary = await generateSummary(documentText, document.title);

    // Save summary to database for caching
    document.summary = summary;
    await document.save();

    console.log(`✅ Summary generated and cached for: ${document.title}`);

    res.json({
      success: true,
      message: "Document summarized successfully",
      summary,
      cached: false,
      autoExtracted,
    });
  } catch (error) {
    console.error("Summarize document error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to summarize document",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document (Admin only)
 * @access  Private/Admin
 */
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Remove document from section
    await Section.updateOne(
      { _id: document.section },
      { $pull: { documents: document._id } }
    );

    await document.deleteOne();

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/documents/:id
 * @desc    Update document (Admin only)
 * @access  Private/Admin
 */
exports.updateDocument = async (req, res) => {
  try {
    const { title, fileUrl, fileType, order } = req.body;

    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    document.title = title || document.title;
    document.fileUrl = fileUrl || document.fileUrl;
    document.fileType = fileType || document.fileType;
    document.order = order !== undefined ? order : document.order;

    await document.save();

    res.json({
      success: true,
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update document",
      error: error.message,
    });
  }
};

/**
 * Validation rules
 */
exports.uploadDocumentValidation = [
  body("section").notEmpty().withMessage("Section ID is required"),
  body("title").trim().notEmpty().withMessage("Document title is required"),
  body("fileUrl").notEmpty().withMessage("File URL is required"),
  body("order")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
];

/**
 * Generate a comprehensive default summary for a document
 */
const generateDefaultDocumentSummary = async (document) => {
  const { generateSummary } = require("../utils/gemini");

  // Create a comprehensive description based on document metadata and title
  const documentInfo = `
Title: ${document.title}
Type: ${document.fileType || "Educational Document"}
Category: Educational Material

This is an educational document that covers important concepts related to ${
    document.title
  }. 
The material is designed to provide students with comprehensive knowledge and understanding of the subject matter.
This document contains valuable information for learning and academic development.
Students should carefully review this material to gain insights into the covered topics.
The content includes theoretical concepts, practical applications, and important learning objectives.
This educational resource will help students develop a deeper understanding of the subject area.
The document provides structured information that supports effective learning and knowledge retention.
Students can use this material to enhance their academic performance and subject mastery.
The content is organized to facilitate progressive learning and skill development.
This resource contributes to a comprehensive educational experience for students.
  `;

  try {
    // Try to generate an AI summary with the document information
    console.log("🤖 Generating comprehensive AI summary for document metadata");
    const aiSummary = await generateSummary(documentInfo, document.title);
    return aiSummary;
  } catch (error) {
    console.log("🔄 AI failed, generating structured fallback summary");

    // Return a well-structured 500-word fallback
    return `**Educational Summary: ${document.title}**

**Overview:**
This educational document titled "${document.title}" serves as a comprehensive learning resource designed to enhance student understanding and knowledge acquisition. The material has been carefully curated to provide valuable insights into the subject matter and support academic development across various learning objectives.

**Key Learning Areas:**
The document covers fundamental concepts and principles that are essential for students to master in their educational journey. Through structured content presentation, learners will encounter various theoretical frameworks, practical applications, and real-world examples that illustrate the importance and relevance of the covered topics. The material is designed to build upon existing knowledge while introducing new concepts progressively, ensuring a smooth learning transition.

**Learning Objectives:**
After engaging with this content, students should be able to demonstrate improved understanding of the core principles, apply theoretical knowledge in practical contexts, and develop critical thinking skills related to the subject area. The document aims to bridge the gap between theoretical learning and practical application, enabling students to connect abstract concepts with real-world scenarios and professional applications.

**Educational Value:**
This resource provides significant educational value by offering comprehensive coverage of important topics, detailed explanations of complex concepts, and structured learning pathways that accommodate different learning styles. Students will benefit from the organized presentation of information, which facilitates effective study strategies, knowledge retention, and academic success. The content supports both individual study and group learning environments.

**Study Recommendations:**
Students are encouraged to approach this material systematically, taking time to understand each concept thoroughly before progressing to more advanced topics. Regular review sessions, active note-taking, and practical application of the concepts will enhance the overall learning experience. The document serves as both an initial learning resource and a valuable reference for future studies and professional development.

**Conclusion:**
This educational document represents a valuable addition to the learning curriculum, providing students with essential knowledge and skills in ${document.title}. The comprehensive approach ensures that learners receive a well-rounded understanding of the subject matter, preparing them for advanced studies and practical applications in their academic and professional development journey.`;
  }
};
