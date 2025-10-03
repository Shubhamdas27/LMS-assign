const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const auth = require("../middleware/auth");

/**
 * Progress Tracking Routes
 */

// @route   GET /api/progress/course/:courseId
// @desc    Get user's progress for a course
// @access  Private
router.get("/course/:courseId", auth, progressController.getCourseProgress);

// @route   POST /api/progress/video/:videoId
// @desc    Mark video as complete
// @access  Private
router.post("/video/:videoId", auth, progressController.markVideoComplete);

// @route   POST /api/progress/document/:documentId
// @desc    Mark document as complete
// @access  Private
router.post(
  "/document/:documentId",
  auth,
  progressController.markDocumentComplete
);

// @route   DELETE /api/progress/video/:videoId
// @desc    Unmark video as complete
// @access  Private
router.delete("/video/:videoId", auth, progressController.unmarkVideoComplete);

module.exports = router;
