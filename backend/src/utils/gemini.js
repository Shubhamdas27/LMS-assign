const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const pdf = require("pdf-parse");

/**
 * Google Gemini AI Configuration
 * For document summarization with PDF support
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

    // Use the latest Gemini model (from API model list)
    model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    console.log("✅ Google Gemini AI initialized with models/gemini-2.5-flash");
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
    const prompt = `You are an expert educational content summarizer and learning specialist. 

Document Title: "${documentTitle}"

IMPORTANT: This is a unique document with specific content. DO NOT provide generic summaries. Analyze the ACTUAL content provided below and create a summary that is specific to THIS document only.

Please create a comprehensive and detailed summary of the following educational document. Your summary must be AT LEAST 500 words and must be based EXCLUSIVELY on the content provided below:

**OVERVIEW SECTION (100-150 words):**
- Main purpose and scope of THIS specific document
- Target audience and learning level for THIS material
- Overall context and importance of THIS content

**KEY CONCEPTS & TOPICS (200-250 words):**
- Detailed explanation of the SPECIFIC concepts covered in THIS document
- Important definitions and terminology found in THIS text
- Core principles and theories discussed in THIS material
- How the concepts in THIS document relate to each other

**LEARNING OUTCOMES & OBJECTIVES (100-150 words):**
- What students will learn from THIS specific material
- Skills and knowledge they will gain from THIS document
- Competencies developed through studying THIS content

**PRACTICAL APPLICATIONS & EXAMPLES (100-150 words):**
- Real-world applications mentioned in THIS document
- Case studies, examples, or scenarios provided in THIS text
- How the knowledge from THIS document can be applied in practice
- Industry relevance and career connections mentioned in THIS material

**CRITICAL POINTS & TAKEAWAYS (50-100 words):**
- Most important information from THIS document that students must remember
- Key insights and conclusions from THIS specific content
- Essential points for exam preparation based on THIS material

CRITICAL INSTRUCTIONS:
1. Base your summary ONLY on the actual content provided below
2. Do NOT add generic educational information not found in the text
3. Reference specific details, examples, and concepts from the document
4. Make the summary unique to this particular document
5. If the document is short, focus on expanding the analysis of what IS present

Document Content:
${documentText}

Please provide a detailed, document-specific summary following the format above. Remember: This must be unique to THIS document's content only.`;

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
 * Downloads and parses PDFs to extract text
 */
const extractTextFromDocument = async (fileUrl, fileType) => {
  try {
    console.log(`Extracting text from ${fileType} document: ${fileUrl}`);

    if (fileType === "pdf") {
      // Download PDF file
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        timeout: 30000, // 30 second timeout
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      // Parse PDF and extract text
      const data = await pdf(response.data);
      let text = data.text;

      // Clean up the text
      text = text
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/\n+/g, "\n") // Replace multiple newlines with single newline
        .trim();

      // Limit text length for AI processing (max ~15000 characters for detailed summaries)
      if (text.length > 15000) {
        text = text.substring(0, 15000) + "...";
        console.log("📄 Text truncated to 15000 characters for AI processing");
      }

      console.log(`✅ Extracted ${text.length} characters from PDF`);
      return text;
    } else {
      // For other file types, return a message
      return `Document type '${fileType}' is not yet supported for automatic text extraction. Please provide the text manually for summarization.`;
    }
  } catch (error) {
    console.error("Error extracting text from document:", error.message);

    // If download fails, provide fallback instructions
    return `Unable to automatically extract text from this document. 
    
Error: ${error.message}

Please try:
1. Manually copy text from the document
2. Paste it in the summarization request
3. Or ensure the document URL is publicly accessible

Document URL: ${fileUrl}`;
  }
};

module.exports = {
  initializeGemini,
  generateSummary,
  extractTextFromDocument,
};
