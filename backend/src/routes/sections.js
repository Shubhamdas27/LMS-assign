const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * Section Routes
 */

// @route   GET /api/sections/course/:courseId
// @desc    Get all sections for a course
// @access  Public
router.get("/course/:courseId", sectionController.getSectionsByCourse);

// @route   POST /api/sections
// @desc    Create new section
// @access  Private/Admin
router.post(
  "/",
  auth,
  admin,
  sectionController.createSectionValidation,
  sectionController.createSection
);

// @route   PUT /api/sections/:id
// @desc    Update section
// @access  Private/Admin
router.put("/:id", auth, admin, sectionController.updateSection);

// @route   DELETE /api/sections/:id
// @desc    Delete section
// @access  Private/Admin
router.delete("/:id", auth, admin, sectionController.deleteSection);

module.exports = router;
