const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

async function testWorkingModel() {
  try {
    console.log("🧪 Testing models/gemini-2.5-flash...");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    const result = await model.generateContent(
      "Summarize this: JavaScript is a programming language."
    );
    const response = await result.response;
    const text = response.text();

    console.log("✅ SUCCESS!");
    console.log("Response:", text);
  } catch (error) {
    console.log("❌ FAILED:", error.message);
  }
}

testWorkingModel();
