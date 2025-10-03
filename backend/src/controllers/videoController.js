const Video = require("../models/Video");
const Section = require("../models/Section");
const { body, validationResult } = require("express-validator");

/**
 * @route   POST /api/videos
 * @desc    Add video to section (Admin only)
 * @access  Private/Admin
 */
exports.createVideo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const {
      section,
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      order,
    } = req.body;

    // Check if section exists
    const sectionDoc = await Section.findById(section);
    if (!sectionDoc) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const video = new Video({
      section,
      title,
      description,
      videoUrl,
      thumbnail,
      duration,
      order,
    });

    await video.save();

    // Add video to section
    sectionDoc.videos.push(video._id);
    await sectionDoc.save();

    res.status(201).json({
      success: true,
      message: "Video added successfully",
      video,
    });
  } catch (error) {
    console.error("Create video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add video",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/videos/:id
 * @desc    Update video (Admin only)
 * @access  Private/Admin
 */
exports.updateVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, duration, order } =
      req.body;

    let video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.videoUrl = videoUrl || video.videoUrl;
    video.thumbnail = thumbnail || video.thumbnail;
    video.duration = duration || video.duration;
    video.order = order !== undefined ? order : video.order;

    await video.save();

    res.json({
      success: true,
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update video",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/videos/:id
 * @desc    Delete video (Admin only)
 * @access  Private/Admin
 */
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Remove video from section
    await Section.updateOne(
      { _id: video.section },
      { $pull: { videos: video._id } }
    );

    await video.deleteOne();

    res.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete video",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/videos/:id
 * @desc    Get single video
 * @access  Private
 */
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error("Get video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch video",
      error: error.message,
    });
  }
};

/**
 * Validation rules
 */
exports.createVideoValidation = [
  body("section").notEmpty().withMessage("Section ID is required"),
  body("title").trim().notEmpty().withMessage("Video title is required"),
  body("videoUrl").notEmpty().withMessage("Video URL is required"),
  body("order")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
];
