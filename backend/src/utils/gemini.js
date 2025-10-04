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
      console.warn("⚠️  GEMINI_API_KEY not found. AI summarization will be disabled.");
      return false;
    }
    
    console.log("🔑 GEMINI_API_KEY found, creating client...");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names in order of preference
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-pro", 
      "gemini-1.0-pro",
      "models/gemini-pro"
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
    console.log(`📝 Truncating text from ${processedText.length} to ${maxLength} chars`);
    processedText = processedText.substring(0, maxLength) + "...";
  }

  try {
    console.log(`🤖 Calling Gemini API for: ${documentTitle}`);
    
    const prompt = `Summarize this educational content in 5-7 bullet points:

Title: ${documentTitle}

Content: ${processedText}

Focus on key concepts, learning outcomes, and important information.`;

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
  console.log("📝 Generating fallback summary");
  
  const words = documentText.split(' ');
  const sentences = documentText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  // Take first few sentences as summary
  const summaryPoints = sentences.slice(0, 5).map((sentence, index) => 
    `• ${sentence.trim()}`
  );
  
  if (summaryPoints.length === 0) {
    return `• This document titled "${documentTitle}" contains educational content.\n• Please review the full document for detailed information.\n• Key concepts and learning objectives are presented in the material.\n• The content is designed for educational purposes.\n• Further study of this material is recommended.`;
  }
  
  return summaryPoints.join('\n');
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
    
    const testResult = await model.generateContent("Say 'Hello, Gemini is working!'");
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
