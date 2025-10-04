const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Google Gemini AI Configuration
 * For document summarization
 */
let genAI = null;
let model = null;

const initializeGemini = async () => {
  try {
    console.log("🔧 Initializing Gemini AI...");

    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "⚠️  GEMINI_API_KEY not found. AI summarization will be disabled."
      );
      return false;
    }

    console.log("🔑 GEMINI_API_KEY found, creating client...");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try different model names in order of preference
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
      "models/gemini-pro",
    ];

    let modelInitialized = false;

    for (const modelName of modelNames) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        model = genAI.getGenerativeModel({ model: modelName });

        // Test the model with a simple request
        const testResult = await model.generateContent("Hello");
        await testResult.response;

        console.log(`✅ Successfully initialized with model: ${modelName}`);
        modelInitialized = true;
        break;
      } catch (error) {
        console.log(`❌ Model ${modelName} failed: ${error.message}`);
        continue;
      }
    }

    if (!modelInitialized) {
      throw new Error("All Gemini models failed to initialize");
    }

    console.log("✅ Google Gemini AI initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Error initializing Gemini AI:", error.message);
    genAI = null;
    model = null;
    return false;
  }
};

/**
 * Check if Gemini AI is properly initialized
 */
const isGeminiInitialized = () => {
  return model !== null && genAI !== null;
};

/**
 * Generate summary for document text
 * @param {string} documentText - Text content to summarize
 * @param {string} documentTitle - Title of the document
 */
const generateSummary = async (documentText, documentTitle = "") => {
  console.log("🔍 Starting generateSummary function...");

  // Check if Gemini is initialized
  if (!model || !genAI) {
    console.log("⚠️ Gemini not initialized, attempting to reinitialize...");
    const initialized = await initializeGemini();
    if (!initialized || !model) {
      return generateFallbackSummary(documentText, documentTitle);
    }
  }

  // Validate input text
  if (!documentText || documentText.trim().length === 0) {
    throw new Error("Document text is empty or invalid.");
  }

  // Limit text length to prevent API issues
  const maxLength = 8000; // Reduced for better reliability
  let processedText = documentText.trim();

  if (processedText.length > maxLength) {
    console.log(
      `📝 Truncating text from ${processedText.length} to ${maxLength} chars`
    );
    processedText = processedText.substring(0, maxLength) + "...";
  }

  try {
    console.log(`🤖 Calling Gemini API for: ${documentTitle}`);

    const prompt = `You are an expert educational content analyst. Create a comprehensive summary of this educational document that is approximately 500 words long.

Document Title: ${documentTitle}

Document Content:
${processedText}

Please provide a detailed summary that includes:

1. **Overview**: A brief introduction to the main topic and its significance (2-3 sentences)

2. **Key Concepts**: Detailed explanation of the most important concepts covered (150-200 words)

3. **Learning Objectives**: What students should understand or be able to do after studying this material (100-150 words)

4. **Important Details**: Specific facts, examples, formulas, or procedures that are crucial to remember (100-150 words)

5. **Practical Applications**: How this knowledge can be applied in real-world scenarios or further studies (50-100 words)

6. **Conclusion**: A brief recap of why this material is important and how it connects to broader learning goals (2-3 sentences)

Format the response as a well-structured, flowing narrative rather than bullet points. Make it comprehensive yet easy to understand for students.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary || summary.trim().length === 0) {
      console.log("⚠️ Empty response from Gemini, using fallback");
      return generateFallbackSummary(documentText, documentTitle);
    }

    console.log(`✅ Gemini summary generated (${summary.length} chars)`);
    return summary;
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    console.log("🔄 Falling back to basic summarization");
    return generateFallbackSummary(documentText, documentTitle);
  }
};

/**
 * Fallback summarization when Gemini fails
 */
const generateFallbackSummary = (documentText, documentTitle) => {
  console.log("📝 Generating detailed fallback summary");

  if (!documentText || documentText.trim().length === 0) {
    return generateDefaultSummary(documentTitle);
  }

  const words = documentText.split(" ");
  const sentences = documentText
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 20);

  // Create a more comprehensive fallback summary
  let summary = `**Overview of ${documentTitle}**\n\n`;

  // Add introduction
  summary += `This educational document covers important concepts related to ${documentTitle}. `;

  if (sentences.length > 0) {
    summary += `The material begins by introducing ${sentences[0]
      .trim()
      .toLowerCase()}. `;
  }

  summary += `This content is designed to provide students with a comprehensive understanding of the subject matter.\n\n`;

  // Add key concepts section
  summary += `**Key Concepts:**\n`;
  if (sentences.length >= 3) {
    summary +=
      sentences
        .slice(0, 3)
        .map((s) => s.trim())
        .join(". ") + ". ";
  }
  summary += `These fundamental concepts form the foundation for understanding more advanced topics in this field. Students should focus on grasping these core principles before moving on to more complex applications.\n\n`;

  // Add learning objectives
  summary += `**Learning Objectives:**\n`;
  summary += `After studying this material, students should be able to understand the main principles presented, apply the concepts in practical scenarios, and demonstrate knowledge of the key terminology and processes. `;

  if (sentences.length >= 5) {
    summary += `Specifically, students will learn about ${sentences[3]
      .trim()
      .toLowerCase()} and ${sentences[4].trim().toLowerCase()}. `;
  }

  summary += `This knowledge will serve as a building block for more advanced studies in the field.\n\n`;

  // Add important details
  summary += `**Important Details:**\n`;
  if (sentences.length > 5) {
    summary +=
      sentences
        .slice(5, Math.min(sentences.length, 8))
        .map((s) => s.trim())
        .join(". ") + ". ";
  }
  summary += `Students should pay particular attention to the specific examples and detailed explanations provided in the document. These details are crucial for developing a thorough understanding of the subject matter.\n\n`;

  // Add conclusion
  summary += `**Conclusion:**\n`;
  summary += `This material provides essential knowledge that is fundamental to understanding ${documentTitle}. Students are encouraged to review the content thoroughly and practice applying the concepts in various contexts. The information presented here will be valuable for both immediate learning objectives and future advanced studies in related areas.`;

  return summary;
};

/**
 * Generate default summary when no content is available
 */
const generateDefaultSummary = (documentTitle) => {
  return `**Educational Summary: ${documentTitle}**\n\n**Overview:**\nThis document titled "${documentTitle}" contains important educational content designed to enhance student learning and understanding. The material has been carefully structured to provide comprehensive coverage of the subject matter.\n\n**Key Concepts:**\nThe document covers fundamental principles and concepts that are essential for students to understand. These concepts are presented in a logical sequence to facilitate effective learning and comprehension. Students will encounter various theoretical frameworks and practical applications throughout the material.\n\n**Learning Objectives:**\nAfter studying this content, students should be able to demonstrate understanding of the core principles, apply the knowledge in relevant contexts, and build upon this foundation for more advanced studies. The material is designed to develop both theoretical understanding and practical skills.\n\n**Important Details:**\nThe document includes specific examples, detailed explanations, and relevant case studies that help illustrate the key concepts. Students should pay careful attention to these details as they provide crucial context and practical applications of the theoretical material.\n\n**Practical Applications:**\nThe knowledge gained from this material can be applied in various real-world scenarios and will serve as a foundation for more advanced studies. Students are encouraged to consider how these concepts relate to their broader educational goals and future career aspirations.\n\n**Conclusion:**\nThis educational material provides a solid foundation for understanding ${documentTitle}. Students should approach the content systematically, taking time to understand each concept thoroughly before progressing to more complex topics. Regular review and practice will help reinforce the learning objectives and ensure long-term retention of the material.`;
};

/**
 * Extract text from different document types
 */
const extractTextFromDocument = async (fileUrl, fileType) => {
  console.log(`Extracting text from ${fileType} document: ${fileUrl}`);

  return `This is a placeholder for text extraction. 
  
  In production, implement:
  1. Download file from: ${fileUrl}
  2. Extract text based on type: ${fileType}
  3. Return extracted text for summarization
  
  For now, you can manually paste document content when requesting summaries.`;
};

/**
 * Test Gemini API connection
 */
const testGeminiConnection = async () => {
  try {
    if (!model) {
      return { success: false, error: "Gemini not initialized" };
    }

    const testResult = await model.generateContent(
      "Say 'Hello, Gemini is working!'"
    );
    const response = await testResult.response;
    const text = response.text();

    return { success: true, response: text };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeGemini,
  isGeminiInitialized,
  generateSummary,
  extractTextFromDocument,
  testGeminiConnection,
};
