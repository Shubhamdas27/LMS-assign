require("dotenv").config();
const { initializeGemini, generateSummary } = require("./src/utils/gemini");

const testSummarization = async () => {
  console.log("🧪 Testing Gemini Summarization...\n");

  // Initialize
  console.log("1️⃣ Initializing Gemini...");
  const initialized = await initializeGemini();
  
  if (!initialized) {
    console.log("❌ Failed to initialize Gemini");
    return;
  }

  // Test summarization
  console.log("\n2️⃣ Testing summarization...");
  const testDocument = `
    React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta.
    React allows developers to create large web applications that can change data, without reloading the page. 
    The main purpose of React is to be fast, scalable, and simple. It works only on user interfaces in the application.
    React uses a virtual DOM that improves app performance. Components are the building blocks of React applications.
  `;

  try {
    const summary = await generateSummary(testDocument, "React Documentation");
    console.log("\n✅ Summary generated successfully!");
    console.log("\n📝 Summary:");
    console.log("─".repeat(80));
    console.log(summary);
    console.log("─".repeat(80));
    console.log(`\n📊 Summary length: ${summary.split(' ').length} words`);
  } catch (error) {
    console.log("\n❌ Summarization failed:", error.message);
  }

  console.log("\n✅ Test complete!");
};

testSummarization();
