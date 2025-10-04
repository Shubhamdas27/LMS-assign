const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Google Gemini AI Configuration
 * For document summarization
 */
let genAI = null;
let model = null;

const initializeGemini = () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "⚠️  GEMINI_API_KEY not found. AI summarization will be disabled."
      );
      return false;
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("✅ Google Gemini AI initialized");
    return true;
  } catch (error) {
    console.error("❌ Error initializing Gemini AI:", error.message);
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
  if (!model) {
    throw new Error("Gemini AI is not initialized. Please check GEMINI_API_KEY environment variable.");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  // Validate input text
  if (!documentText || documentText.trim().length === 0) {
    throw new Error("Document text is empty or invalid.");
  }

  // Limit text length to prevent API issues (Gemini has token limits)
  const maxLength = 10000; // Approximately 10k characters
  let processedText = documentText.trim();
  
  if (processedText.length > maxLength) {
    console.log(`📝 Document text too long (${processedText.length} chars), truncating to ${maxLength}`);
    processedText = processedText.substring(0, maxLength) + "...";
  }

  try {
    console.log(`🤖 Calling Gemini API for document: ${documentTitle}`);
    console.log(`📄 Text length: ${processedText.length} characters`);
    
    const prompt = `You are an expert educational content summarizer. 
    
Document Title: ${documentTitle}

Please summarize the following educational document in 5-7 clear bullet points, highlighting:
- Key concepts and main ideas
- Important learning outcomes
- Critical information students should remember
- Practical applications or examples if mentioned

Document Content:
${processedText}

Provide only the bullet points, no additional formatting or explanations.`;

    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error("Invalid response from Gemini AI");
    }
    
    const response = await result.response;
    const summary = response.text();

    if (!summary || summary.trim().length === 0) {
      throw new Error("Gemini AI returned empty summary");
    }

    console.log(`✅ Summary generated successfully (${summary.length} chars)`);
    return summary;
  } catch (error) {
    console.error("❌ Gemini API Error:", {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details || error.toString()
    });
    
    // Provide more specific error messages based on error type
    if (error.message?.includes('quota')) {
      throw new Error("AI service quota exceeded. Please try again later.");
    } else if (error.message?.includes('API key')) {
      throw new Error("AI service authentication failed. Please check configuration.");
    } else if (error.message?.includes('SAFETY')) {
      throw new Error("Content filtered by AI safety systems. Please try with different text.");
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error("Unable to connect to AI service. Please check network connection.");
    } else {
      throw new Error(`AI summarization failed: ${error.message || 'Unknown error occurred'}`);
    }
  }
};

/**
 * Extract text from different document types
 * This is a placeholder - in production, you'd use libraries like:
 * - pdf-parse for PDFs
 * - mammoth for DOCX
 * - Any other appropriate library for different formats
 */
const extractTextFromDocument = async (fileUrl, fileType) => {
  // For this implementation, we'll return a placeholder
  // In production, you would:
  // 1. Download the file from fileUrl
  // 2. Use appropriate library to extract text based on fileType
  // 3. Return the extracted text

  console.log(`Extracting text from ${fileType} document: ${fileUrl}`);

  // Placeholder: Return instructions for manual implementation
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
