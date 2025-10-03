const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const { initializeGemini } = require("../src/utils/gemini");
const createApp = require("../src/app");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Gemini AI
initializeGemini();

// Create Express app
const app = createApp();

module.exports = app;
