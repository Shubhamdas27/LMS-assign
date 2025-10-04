const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Simple Gemini AI Summarization
 * Generates 500-word summaries from document content
 */

let genAI = null;
let model = null;
let currentModelName = null;

/**
 * Initialize Gemini AI
 */
const initializeGemini = async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ GEMINI_API_KEY not found - AI summarization disabled");
      return false;
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try working models (tested October 2025)
    const models = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-flash-latest",
    ];

    for (const modelName of models) {
      try {
        console.log(`🔄 Trying model: ${modelName}...`);
        model = genAI.getGenerativeModel({ model: modelName });

        // Quick test
        const test = await model.generateContent("Hi");
        await test.response.text();

        currentModelName = modelName;
        console.log(`✅ Gemini AI initialized with model: ${modelName}`);
        return true;
      } catch (err) {
        console.log(`❌ Model ${modelName} failed, trying next...`);
        continue;
      }
    }

    console.warn("⚠️ No working Gemini models found");
    return false;
  } catch (error) {
    console.error("❌ Gemini initialization failed:", error.message);
    console.warn("⚠️ AI summarization will be disabled");
    return false;
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
      const initialized = await initializeGemini();
      if (!initialized || !model) {
        throw new Error(
          "AI summarization is currently unavailable. Please check your GEMINI_API_KEY configuration."
        );
      }
    }

    if (!documentText || documentText.trim().length === 0) {
      throw new Error("Document text is empty");
    }

    // Build prompt for minimum 500-word summary
    const prompt = `You are an educational content summarizer. Create a comprehensive summary of the following document.

**Document Title:** ${documentTitle}

**Document Content:**
${documentText}

**CRITICAL INSTRUCTIONS - MUST FOLLOW:**
1. Write AT LEAST 500 words (minimum requirement - aim for 500-700 words)
2. Create a well-structured, flowing summary with multiple paragraphs
3. Include ALL key concepts, main points, and important details
4. Use clear, educational language suitable for students
5. Make it informative, comprehensive, and academically valuable
6. Ensure the summary is detailed and thorough - DO NOT make it brief
7. If the content is short, expand on the concepts and provide context

**Summary (Minimum 500 words):**`;

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
    modelName: currentModelName,
  };
};

module.exports = {
  initializeGemini,
  generateSummary,
  isGeminiInitialized,
  getModelInfo,
};
