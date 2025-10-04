const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Simple Gemini AI Summarization
 * Generates 500-word summaries from document content
 */

let genAI = null;
let model = null;

/**
 * Initialize Gemini AI
 */
const initializeGemini = async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("✅ Gemini AI initialized");
    return true;
  } catch (error) {
    console.error("❌ Gemini initialization failed:", error.message);
    throw error;
  }
};

/**
 * Check if Gemini is initialized
 */
const isGeminiInitialized = () => {
  return model !== null;
};

/**
 * Generate 500-word summary from document content
 * @param {string} documentText - The document content to summarize
 * @param {string} documentTitle - Title of the document
 * @returns {Promise<string>} Generated 500-word summary
 */
const generateSummary = async (documentText, documentTitle = "Document") => {
  try {
    // Initialize if not already done
    if (!model) {
      await initializeGemini();
    }

    if (!documentText || documentText.trim().length === 0) {
      throw new Error("Document text is empty");
    }

    // Build prompt for 500-word summary
    const prompt = `You are an educational content summarizer. Create a comprehensive 500-word summary of the following document.

**Document Title:** ${documentTitle}

**Document Content:**
${documentText}

**Instructions:**
- Write exactly 500 words (approximately)
- Create a well-structured, flowing summary
- Include key concepts, main points, and important details
- Use clear, educational language
- Make it informative and comprehensive

**Summary:**`;

    // Generate summary
    console.log(`📝 Generating summary for: ${documentTitle}`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary || summary.trim().length === 0) {
      throw new Error("Generated summary is empty");
    }

    console.log(`✅ Summary generated successfully`);
    return summary;
  } catch (error) {
    console.error("❌ Summary generation failed:", error.message);
    throw error;
  }
};

/**
 * Get model information
 */
const getModelInfo = () => {
  return {
    initialized: isGeminiInitialized(),
    modelName: model ? "gemini-1.5-flash" : null,
  };
};

module.exports = {
  initializeGemini,
  generateSummary,
  isGeminiInitialized,
  getModelInfo,
};
