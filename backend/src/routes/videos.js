const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * Video Routes
 */

// @route   GET /api/videos
// @desc    Get all videos
// @access  Private/Admin
router.get("/", auth, admin, videoController.getAllVideos);

// @route   GET /api/videos/section/:sectionId
// @desc    Get videos by section
// @access  Private
router.get("/section/:sectionId", auth, videoController.getVideosBySection);

// @route   GET /api/videos/:id
// @desc    Get single video
// @access  Private
router.get("/:id", auth, videoController.getVideoById);

// @route   POST /api/videos
// @desc    Add video to section
// @access  Private/Admin
router.post(
  "/",
  auth,
  admin,
  videoController.createVideoValidation,
  videoController.createVideo
);

// @route   PUT /api/videos/:id
// @desc    Update video
// @access  Private/Admin
router.put("/:id", auth, admin, videoController.updateVideo);

// @route   DELETE /api/videos/:id
// @desc    Delete video
// @access  Private/Admin
router.delete("/:id", auth, admin, videoController.deleteVideo);

module.exports = router;
