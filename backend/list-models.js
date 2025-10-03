const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

async function listAvailableModels() {
  try {
    console.log(
      "🔑 API Key:",
      process.env.GEMINI_API_KEY ? "Present" : "Missing"
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Try to list models
    console.log("📋 Attempting to list available models...");

    // This might not work with all versions, so let's try the direct API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("\n✅ Available models:");
    data.models.forEach((model) => {
      console.log(`- ${model.name}`);
      if (
        model.supportedGenerationMethods &&
        model.supportedGenerationMethods.includes("generateContent")
      ) {
        console.log(`  ✅ Supports generateContent`);
      }
    });
  } catch (error) {
    console.error("❌ Error listing models:", error.message);

    // Try a simple test with a known working model name
    console.log("\n🧪 Testing with basic gemini model...");
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("test");
      console.log("✅ Basic test successful");
    } catch (testError) {
      console.log("❌ Basic test failed:", testError.message);
    }
  }
}

listAvailableModels();
