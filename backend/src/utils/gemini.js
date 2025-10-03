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
 * Generate summary for document text
 * @param {string} documentText - Text content to summarize
 * @param {string} documentTitle - Title of the document
 */
const generateSummary = async (documentText, documentTitle = "") => {
  if (!model) {
    throw new Error("Gemini AI is not initialized");
  }

  try {
    const prompt = `You are an expert educational content summarizer. 
    
Document Title: ${documentTitle}

Please summarize the following educational document in 5-7 clear bullet points, highlighting:
- Key concepts and main ideas
- Important learning outcomes
- Critical information students should remember
- Practical applications or examples if mentioned

Document Content:
${documentText}

Provide only the bullet points, no additional formatting or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate AI summary. Please try again later.");
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

module.exports = {
  initializeGemini,
  generateSummary,
  extractTextFromDocument,
};
