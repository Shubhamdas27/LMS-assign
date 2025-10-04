const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const { initializeGemini } = require("../src/utils/gemini");
const createApp = require("../src/app");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Gemini AI (non-blocking)
initializeGemini().catch(err => {
  console.warn('⚠️  Gemini AI not available:', err.message);
  console.warn('⚠️  AI summarization will be disabled');
});

// Create Express app
const app = createApp();

module.exports = app;
