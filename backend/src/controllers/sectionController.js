const Section = require("../models/Section");
const Course = require("../models/Course");
const Video = require("../models/Video");
const Document = require("../models/Document");
const { body, validationResult } = require("express-validator");

/**
 * @route   POST /api/sections
 * @desc    Create new section (Admin only)
 * @access  Private/Admin
 */
exports.createSection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { course, title, description, order } = req.body;

    // Check if course exists
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const section = new Section({
      course,
      title,
      description,
      order,
    });

    await section.save();

    // Add section to course
    courseDoc.sections.push(section._id);
    await courseDoc.save();

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      section,
    });
  } catch (error) {
    console.error("Create section error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create section",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/sections/:id
 * @desc    Update section (Admin only)
 * @access  Private/Admin
 */
exports.updateSection = async (req, res) => {
  try {
    const { title, description, order } = req.body;

    let section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    section.title = title || section.title;
    section.description = description || section.description;
    section.order = order !== undefined ? order : section.order;

    await section.save();

    res.json({
      success: true,
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    console.error("Update section error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update section",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/sections/:id
 * @desc    Delete section and all its content (Admin only)
 * @access  Private/Admin
 */
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Delete all videos in section
    await Video.deleteMany({ section: section._id });

    // Delete all documents in section
    await Document.deleteMany({ section: section._id });

    // Remove section from course
    await Course.updateOne(
      { _id: section.course },
      { $pull: { sections: section._id } }
    );

    await section.deleteOne();

    res.json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Delete section error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete section",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/sections/course/:courseId
 * @desc    Get all sections for a course
 * @access  Public
 */
exports.getSectionsByCourse = async (req, res) => {
  try {
    const sections = await Section.find({ course: req.params.courseId })
      .populate("videos")
      .populate("documents")
      .sort({ order: 1 });

    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    console.error("Get sections error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sections",
      error: error.message,
    });
  }
};

/**
 * Validation rules
 */
exports.createSectionValidation = [
  body("course").notEmpty().withMessage("Course ID is required"),
  body("title").trim().notEmpty().withMessage("Section title is required"),
  body("order")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
];
