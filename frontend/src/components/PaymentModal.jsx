import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../services/api";

/**
 * Payment Modal Component
 * Handles Razorpay payment integration
 */
const PaymentModal = ({ show, onHide, course, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order
      const orderResponse = await api.post("/payment/create-order", {
        courseId: course._id,
      });

      if (!orderResponse.data.success) {
        throw new Error("Failed to create order");
      }

      const { order, key } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "LMS Platform",
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              toast.success("Payment successful! You are now enrolled.");
              onHide();
              if (onSuccess) {
                onSuccess(course._id);
              }
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        notes: {
          course_id: course._id,
          course_name: course.title,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed. Please try again.");
      });

      rzp.open();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to process payment");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enroll in Course</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center">
          <img
            src={course?.thumbnail}
            alt={course?.title}
            className="img-fluid rounded mb-3"
            style={{ maxHeight: "200px" }}
          />
          <h5>{course?.title}</h5>
          <p className="text-muted">
            {course?.description?.substring(0, 100)}...
          </p>

          <div className="bg-light p-3 rounded my-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Course Price:</span>
              <span className="fw-bold">₹{course?.price}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Tax:</span>
              <span>₹0</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold fs-5" style={{ color: "#4F46E5" }}>
                ₹{course?.price}
              </span>
            </div>
          </div>

          <Alert variant="info" className="small">
            <strong>Test Mode:</strong> Use card 4111 1111 1111 1111 with any
            future expiry and CVV
          </Alert>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#4F46E5" }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Processing...
            </>
          ) : (
            "Proceed to Pay ₹" + course?.price
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
