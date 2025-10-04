const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const User = require("../models/User");
const Progress = require("../models/Progress");

/**
 * Initialize Razorpay
 */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Log Razorpay initialization status
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay credentials missing:", {
    key_id: !!process.env.RAZORPAY_KEY_ID,
    key_secret: !!process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.log("✅ Razorpay initialized with credentials");
}

/**
 * @route   POST /api/payment/create-order
 * @desc    Create Razorpay order for course payment
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is already enrolled
    const user = await User.findById(req.user.id);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Create Razorpay order
    const options = {
      amount: course.price * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: req.user.id,
        courseName: course.title,
      },
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      course: courseId,
      amount: course.price,
      razorpayOrderId: order.id,
      status: "pending",
    });

    await payment.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
      course: {
        id: course._id,
        title: course.title,
        price: course.price,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/payment/verify
 * @desc    Verify payment signature and enroll user
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.log("Payment verification attempt:", {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature_received: razorpay_signature ? "Yes" : "No",
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("Missing verification details:", {
        order_id: !!razorpay_order_id,
        payment_id: !!razorpay_payment_id,
        signature: !!razorpay_signature,
      });
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Check if Razorpay credentials are available
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET not found in environment variables");
      return res.status(500).json({
        success: false,
        message: "Payment service configuration error",
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log("Signature verification:", {
      expected: expectedSignature,
      received: razorpay_signature,
      match: razorpay_signature === expectedSignature,
    });

    if (razorpay_signature !== expectedSignature) {
      // Payment verification failed
      console.log("Payment verification failed - signature mismatch");
      await Payment.updateOne(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
        debug: {
          expected: expectedSignature,
          received: razorpay_signature,
        },
      });
    }

    // Payment verified successfully
    console.log("✅ Payment signature verified successfully");

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      console.log("❌ Payment record not found for order:", razorpay_order_id);
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
        debug: {
          orderId: razorpay_order_id,
        },
      });
    }

    console.log("Found payment record:", {
      id: payment._id,
      user: payment.user,
      course: payment.course,
      amount: payment.amount,
    });

    // Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "completed";
    payment.completedAt = Date.now();
    await payment.save();

    // Enroll user in course
    const user = await User.findById(payment.user);
    const course = await Course.findById(payment.course);

    if (!user.enrolledCourses.includes(course._id)) {
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
    }

    res.json({
      success: true,
      message: "Payment verified successfully. You are now enrolled!",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/payment/my-payments
 * @desc    Get user's payment history
 * @access  Private
 */
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("course", "title thumbnail price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/payment/all
 * @desc    Get all payments (Admin only)
 * @access  Private/Admin
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    // Calculate total revenue
    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      payments,
      totalRevenue,
      totalTransactions: payments.length,
      completedTransactions: payments.filter((p) => p.status === "completed")
        .length,
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};
