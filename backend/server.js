const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const { initializeGemini } = require("./src/utils/gemini");
const createApp = require("./src/app");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Gemini AI
initializeGemini();

// Create Express app
const app = createApp();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `\n🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated!");
  });
});

module.exports = app;
