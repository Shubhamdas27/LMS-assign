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

  // CORS Configuration - Explicit and permissive for debugging
  app.use(
    cors({
      origin: true, // Allow all origins for now
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With", 
        "Content-Type",
        "Accept",
        "Authorization",
        "x-auth-token",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Methods"
      ],
      exposedHeaders: ["x-auth-token"],
      preflightContinue: false,
      optionsSuccessStatus: 200
    })
  );

  // Additional CORS headers for preflight requests
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token");
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    next();
  });

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
