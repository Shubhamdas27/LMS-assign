/**
 * Admin Authorization Middleware
 * Checks if authenticated user has admin role
 * Must be used after auth middleware
 */
const admin = (req, res, next) => {
  try {
    // Check if user exists (should be attached by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authorization check failed. Please try again.",
    });
  }
};

module.exports = admin;
