const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

async function testGeminiModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Test different model names
    const modelsToTest = [
      "gemini-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest",
      "models/gemini-pro",
      "models/gemini-1.5-pro",
    ];

    console.log("🧪 Testing Gemini models...\n");

    for (const modelName of modelsToTest) {
      try {
        console.log(`Testing: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Try a simple generate content call
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();

        console.log(`✅ ${modelName} - SUCCESS`);
        console.log(`   Response: ${text.substring(0, 50)}...\n`);

        // If we get here, this model works
        break;
      } catch (error) {
        console.log(`❌ ${modelName} - FAILED: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error("Error testing models:", error);
  }
}

testGeminiModels();
