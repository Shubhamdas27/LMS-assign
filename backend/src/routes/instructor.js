const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Section = require("../models/Section");

/**
 * @route   GET /api/instructor/courses
 * @desc    Get instructor's courses
 * @access  Private/Instructor
 */
router.get("/courses", auth, async (req, res) => {
  try {
    // Get courses created by this instructor
    let courses = await Course.find({ instructor: req.user.id })
      .populate({
        path: "sections",
        populate: [{ path: "videos" }, { path: "documents" }],
      })
      .sort({ createdAt: -1 });

    // For demo instructor with no created courses, return sample courses
    if (
      courses.length === 0 &&
      (req.user.name === "Demo Instructor" ||
        req.user.email?.includes("instructor"))
    ) {
      courses = await Course.find()
        .populate({
          path: "sections",
          populate: [{ path: "videos" }, { path: "documents" }],
        })
        .limit(3)
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * @route   GET /api/instructor/earnings
 * @desc    Get instructor earnings
 * @access  Private/Instructor
 */
router.get("/earnings", auth, async (req, res) => {
  try {
    const Payment = require("../models/Payment");
    const Course = require("../models/Course");
    const User = require("../models/User");

    // Get payments for courses created by this instructor
    const instructorCourses = await Course.find({
      instructor: req.user.id,
    }).select("_id title");
    const courseIds = instructorCourses.map((course) => course._id);

    let earnings = [];

    if (courseIds.length > 0) {
      earnings = await Payment.find({
        course: { $in: courseIds },
        status: "completed",
      })
        .populate("course", "title price")
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    }

    // For demo instructor, show some sample earnings based on actual courses
    if (
      (req.user.name === "Demo Instructor" ||
        req.user.email?.includes("instructor")) &&
      earnings.length === 0
    ) {
      // Get first 3 courses and create sample earnings
      const demoCourses = await Course.find().limit(3);
      const demoUsers = await User.find({ role: { $ne: "admin" } }).limit(5);

      earnings = [
        {
          _id: "demo1",
          course: {
            title: demoCourses[0]?.title || "JavaScript Fundamentals",
            price: 599,
          },
          user: {
            name: demoUsers[0]?.name || "John Doe",
            email: demoUsers[0]?.email || "john@example.com",
          },
          amount: 599,
          createdAt: new Date(),
          status: "completed",
        },
        {
          _id: "demo2",
          course: {
            title: demoCourses[1]?.title || "React Development",
            price: 799,
          },
          user: {
            name: demoUsers[1]?.name || "Jane Smith",
            email: demoUsers[1]?.email || "jane@example.com",
          },
          amount: 799,
          createdAt: new Date(Date.now() - 86400000),
          status: "completed",
        },
        {
          _id: "demo3",
          course: {
            title: demoCourses[2]?.title || "Node.js Basics",
            price: 699,
          },
          user: {
            name: demoUsers[2]?.name || "Mike Johnson",
            email: demoUsers[2]?.email || "mike@example.com",
          },
          amount: 699,
          createdAt: new Date(Date.now() - 172800000),
          status: "pending",
        },
      ];
    }

    const totalEarnings = earnings
      .filter((earning) => earning.status === "completed")
      .reduce(
        (sum, earning) => sum + (earning.amount || earning.course?.price || 0),
        0
      );

    res.json({
      success: true,
      earnings,
      totalEarnings,
    });
  } catch (error) {
    console.error("Get instructor earnings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * @route   GET /api/instructor/stats
 * @desc    Get instructor dashboard stats
 * @access  Private/Instructor
 */
router.get("/stats", auth, async (req, res) => {
  try {
    const Course = require("../models/Course");
    const Payment = require("../models/Payment");
    const User = require("../models/User");

    // Get instructor's courses
    const instructorCourses = await Course.find({ instructor: req.user.id });
    const courseIds = instructorCourses.map((course) => course._id);

    let stats = {
      totalEarnings: 0,
      totalCourses: instructorCourses.length,
      totalStudents: 0,
      avgRating: 0,
      thisMonthEarnings: 0,
    };

    if (courseIds.length > 0) {
      // Calculate total earnings
      const payments = await Payment.find({
        course: { $in: courseIds },
        status: "completed",
      });

      stats.totalEarnings = payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Calculate this month earnings
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const thisMonthPayments = payments.filter(
        (payment) => new Date(payment.createdAt) >= thisMonth
      );
      stats.thisMonthEarnings = thisMonthPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Get unique students count
      const uniqueStudents = [
        ...new Set(payments.map((p) => p.user.toString())),
      ];
      stats.totalStudents = uniqueStudents.length;

      // Calculate average rating (for demo, using a calculation based on courses)
      const totalRatings = instructorCourses.reduce(
        (sum, course) => sum + (course.rating || 4.5),
        0
      );
      stats.avgRating =
        instructorCourses.length > 0
          ? (totalRatings / instructorCourses.length).toFixed(1)
          : 0;
    }

    // For demo instructor with no real data, provide sample stats
    if (
      (req.user.name === "Demo Instructor" ||
        req.user.email?.includes("instructor")) &&
      stats.totalEarnings === 0
    ) {
      stats = {
        totalEarnings: 27000,
        totalCourses: 3,
        totalStudents: 77,
        avgRating: 4.6,
        thisMonthEarnings: 8100,
      };
    }

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get instructor stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
