const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * Course Routes
 */

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get("/", courseController.getAllCourses);

// @route   GET /api/courses/my-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get("/my-courses", auth, courseController.getMyCourses);

// @route   GET /api/courses/instructor
// @desc    Get instructor's created courses
// @access  Private/Instructor
router.get("/instructor", auth, courseController.getInstructorCourses);

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get("/:id", courseController.getCourseById);

// @route   POST /api/courses
// @desc    Create new course
// @access  Private/Admin
router.post(
  "/",
  auth,
  admin,
  courseController.createCourseValidation,
  courseController.createCourse
);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Admin
router.put("/:id", auth, admin, courseController.updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Admin
router.delete("/:id", auth, admin, courseController.deleteCourse);

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in course
// @access  Private
router.post("/:id/enroll", auth, courseController.enrollInCourse);

module.exports = router;
