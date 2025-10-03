const Progress = require("../models/Progress");
const Course = require("../models/Course");
const Section = require("../models/Section");
const Video = require("../models/Video");
const Document = require("../models/Document");

/**
 * Calculate progress percentage for a course
 */
const calculateProgressPercentage = async (
  courseId,
  completedVideos,
  completedDocuments
) => {
  try {
    const course = await Course.findById(courseId).populate("sections");

    let totalVideos = 0;
    let totalDocuments = 0;

    for (const sectionId of course.sections) {
      const section = await Section.findById(sectionId);
      totalVideos += section.videos.length;
      totalDocuments += section.documents.length;
    }

    const totalContent = totalVideos + totalDocuments;

    if (totalContent === 0) return 0;

    const completedContent = completedVideos.length + completedDocuments.length;
    const percentage = Math.round((completedContent / totalContent) * 100);

    return percentage;
  } catch (error) {
    console.error("Calculate progress error:", error);
    return 0;
  }
};

/**
 * @route   GET /api/progress/course/:courseId
 * @desc    Get user's progress for a course
 * @access  Private
 */
exports.getCourseProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId,
    })
      .populate("completedVideos")
      .populate("completedDocuments");

    if (!progress) {
      // Create initial progress if doesn't exist
      progress = new Progress({
        user: req.user.id,
        course: req.params.courseId,
        progressPercentage: 0,
      });
      await progress.save();
    }

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/progress/video/:videoId
 * @desc    Mark video as complete
 * @access  Private
 */
exports.markVideoComplete = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Get section and course
    const section = await Section.findById(video.section);
    const courseId = section.course;

    // Find or create progress
    let progress = await Progress.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        course: courseId,
      });
    }

    // Check if already completed
    if (!progress.completedVideos.includes(video._id)) {
      progress.completedVideos.push(video._id);

      // Recalculate progress percentage
      progress.progressPercentage = await calculateProgressPercentage(
        courseId,
        progress.completedVideos,
        progress.completedDocuments
      );

      progress.lastAccessed = Date.now();
      await progress.save();
    }

    res.json({
      success: true,
      message: "Video marked as complete",
      progress: progress.progressPercentage,
    });
  } catch (error) {
    console.error("Mark video complete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark video as complete",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/progress/document/:documentId
 * @desc    Mark document as complete
 * @access  Private
 */
exports.markDocumentComplete = async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Get section and course
    const section = await Section.findById(document.section);
    const courseId = section.course;

    // Find or create progress
    let progress = await Progress.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        course: courseId,
      });
    }

    // Check if already completed
    if (!progress.completedDocuments.includes(document._id)) {
      progress.completedDocuments.push(document._id);

      // Recalculate progress percentage
      progress.progressPercentage = await calculateProgressPercentage(
        courseId,
        progress.completedVideos,
        progress.completedDocuments
      );

      progress.lastAccessed = Date.now();
      await progress.save();
    }

    res.json({
      success: true,
      message: "Document marked as complete",
      progress: progress.progressPercentage,
    });
  } catch (error) {
    console.error("Mark document complete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark document as complete",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/progress/video/:videoId
 * @desc    Unmark video as complete
 * @access  Private
 */
exports.unmarkVideoComplete = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const section = await Section.findById(video.section);
    const courseId = section.course;

    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    // Remove video from completed list
    progress.completedVideos = progress.completedVideos.filter(
      (v) => v.toString() !== video._id.toString()
    );

    // Recalculate progress
    progress.progressPercentage = await calculateProgressPercentage(
      courseId,
      progress.completedVideos,
      progress.completedDocuments
    );

    await progress.save();

    res.json({
      success: true,
      message: "Video unmarked as complete",
      progress: progress.progressPercentage,
    });
  } catch (error) {
    console.error("Unmark video error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unmark video",
      error: error.message,
    });
  }
};
