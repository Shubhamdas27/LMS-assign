const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * Payment Routes
 */

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post("/create-order", auth, paymentController.createOrder);

// @route   POST /api/payment/verify
// @desc    Verify payment signature
// @access  Private
router.post("/verify", auth, paymentController.verifyPayment);

// @route   GET /api/payment/my-payments
// @desc    Get user's payment history
// @access  Private
router.get("/my-payments", auth, paymentController.getMyPayments);

// @route   GET /api/payment/all
// @desc    Get all payments (Admin)
// @access  Private/Admin
router.get("/all", auth, admin, paymentController.getAllPayments);

module.exports = router;
