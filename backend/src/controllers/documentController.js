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

      if (!manualText) {
        return res.status(400).json({
          success: false,
          message: "Please provide document text for summarization",
          note: "Automatic text extraction is not available for this document type",
        });
      }

      documentText = manualText;
      console.log("📝 Using manually provided text for summarization");
    }

    // Generate summary using Gemini AI
    console.log(`🤖 Generating AI summary for: ${document.title}`);
    
    // Check if Gemini is properly initialized
    const { isGeminiInitialized } = require("../utils/gemini");
    if (!isGeminiInitialized()) {
      console.log("⚠️ Gemini AI not available, returning fallback message");
      
      // Save a fallback summary instead of failing
      const fallbackSummary = `📄 **${document.title}**

AI summarization is currently unavailable. Please review the document manually.

**To enable AI summarization:**
- Ensure GEMINI_API_KEY is configured in the environment
- Contact administrator for assistance

**Document Details:**
- Type: ${document.fileType || 'Unknown'}
- Added: ${document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'Unknown'}`;

      document.summary = fallbackSummary;
      await document.save();

      return res.json({
        success: true,
        message: "AI summarization unavailable. Fallback summary provided.",
        summary: fallbackSummary,
        cached: false,
        aiAvailable: false
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
