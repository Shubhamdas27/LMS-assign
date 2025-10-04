const Course = require("../models/Course");
const Section = require("../models/Section");
const User = require("../models/User");
const Progress = require("../models/Progress");
const { body, validationResult } = require("express-validator");

/**
 * @route   GET /api/courses
 * @desc    Get all courses with pagination
 * @access  Public
 */
exports.getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const courses = await Course.find()
      .populate("instructor", "name email")
      .populate({
        path: "sections",
        populate: [
          { path: "videos", options: { sort: { order: 1 } } },
          { path: "documents", options: { sort: { order: 1 } } },
        ],
        options: { sort: { order: 1 } },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments();

    res.json({
      success: true,
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course with all sections, videos, and documents
 * @access  Public
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email avatar")
      .populate({
        path: "sections",
        populate: [
          { path: "videos", options: { sort: { order: 1 } } },
          { path: "documents", options: { sort: { order: 1 } } },
        ],
        options: { sort: { order: 1 } },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/courses
 * @desc    Create new course (Admin only)
 * @access  Private/Admin
 */
exports.createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, description, thumbnail, price, category, level, duration } =
      req.body;

    const course = new Course({
      title,
      description,
      thumbnail,
      price: price || 500,
      instructor: req.user.id,
      category,
      level,
      duration,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course (Admin only)
 * @access  Private/Admin
 */
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, price, category, level, duration } =
      req.body;

    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.thumbnail = thumbnail || course.thumbnail;
    course.price = price !== undefined ? price : course.price;
    course.category = category || course.category;
    course.level = level || course.level;
    course.duration = duration || course.duration;

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course and all related sections, videos, documents (Admin only)
 * @access  Private/Admin
 */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Delete all sections and their content
    await Section.deleteMany({ course: course._id });

    // Delete progress records
    await Progress.deleteMany({ course: course._id });

    // Remove from users' enrolled courses
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );

    await course.deleteOne();

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/courses/:id/enroll
 * @desc    Enroll user in course (after payment)
 * @access  Private
 */
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(course._id);
    await user.save();

    // Increment total students
    course.totalStudents += 1;
    await course.save();

    // Create initial progress record
    const progress = new Progress({
      user: user._id,
      course: course._id,
      progressPercentage: 0,
    });
    await progress.save();

    res.json({
      success: true,
      message: "Successfully enrolled in course",
      course,
    });
  } catch (error) {
    console.error("Enroll course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/courses/my-courses
 * @desc    Get user's enrolled courses
 * @access  Private
 */
exports.getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "enrolledCourses",
      populate: {
        path: "instructor",
        select: "name",
      },
    });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        const progress = await Progress.findOne({
          user: user._id,
          course: course._id,
        });

        return {
          ...course.toObject(),
          progress: progress ? progress.progressPercentage : 0,
        };
      })
    );

    res.json({
      success: true,
      courses: coursesWithProgress,
    });
  } catch (error) {
    console.error("Get my courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/courses/instructor
 * @desc    Get instructor's created courses
 * @access  Private/Instructor
 */
exports.getInstructorCourses = async (req, res) => {
  try {
    // For demo purposes, if user is the Demo Instructor, return courses they "created"
    // In production, filter by actual instructor field
    const courses = await Course.find({ instructor: req.user.id })
      .populate({
        path: "sections",
        populate: [{ path: "videos" }, { path: "documents" }],
      })
      .sort({ createdAt: -1 });

    // If no courses found for instructor (demo scenario), return some sample courses
    if (
      courses.length === 0 &&
      (req.user.name === "Demo Instructor" ||
        req.user.email?.includes("instructor"))
    ) {
      // Return first 2-3 courses as if this instructor created them
      const demoCourses = await Course.find()
        .populate({
          path: "sections",
          populate: [{ path: "videos" }, { path: "documents" }],
        })
        .limit(3)
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        courses: demoCourses,
        message: "Demo instructor courses",
      });
    }

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses",
      error: error.message,
    });
  }
};

/**
 * Validation rules for creating course
 */
exports.createCourseValidation = [
  body("title").trim().notEmpty().withMessage("Course title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required"),
];
