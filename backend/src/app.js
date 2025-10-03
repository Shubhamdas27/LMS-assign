const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

/**
 * Create Express Application
 */
const createApp = () => {
  const app = express();

  // Security Middleware
  app.use(helmet());

  // CORS Configuration - Allow all Vercel domains
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Allow all Vercel and localhost origins
        if (
          origin.includes(".vercel.app") ||
          origin.includes("localhost") ||
          origin.includes("127.0.0.1") ||
          origin === process.env.CLIENT_URL ||
          origin === process.env.CORS_ORIGIN
        ) {
          callback(null, true);
        } else {
          console.log("CORS blocked origin:", origin);
          callback(null, true); // Temporarily allow all origins for debugging
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-auth-token",
        "Access-Control-Allow-Origin",
      ],
      preflightContinue: false,
      optionsSuccessStatus: 200,
    })
  );

  // Body Parser Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  // API Routes
  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/courses", require("./routes/courses"));
  app.use("/api/sections", require("./routes/sections"));
  app.use("/api/videos", require("./routes/videos"));
  app.use("/api/documents", require("./routes/documents"));
  app.use("/api/progress", require("./routes/progress"));
  app.use("/api/payment", require("./routes/payment"));
  app.use("/api/instructor", require("./routes/instructor"));

  // Health Check Route
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "LMS API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "2.0.0",
    });
  });

  // Serve Static Assets in Production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("*", (req, res) => {
      res.sendFile(
        path.resolve(__dirname, "../frontend", "build", "index.html")
      );
    });
  }

  // Error Handling Middleware
  app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  });

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.path,
    });
  });

  return app;
};

module.exports = createApp;
