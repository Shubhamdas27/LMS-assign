import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaClock,
  FaGlobe,
} from "react-icons/fa";
import { toast } from "react-toastify";

/**
 * Contact Us Page
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: "#f8f9ff" }}>
      {/* Hero Section */}
      <div
        className="text-white py-5"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
          paddingTop: "100px !important",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1 className="display-4 fw-bold mb-3">Get In Touch</h1>
              <p className="lead mb-0">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Content */}
      <Container className="py-5">
        <Row className="g-4">
          {/* Contact Form */}
          <Col lg={8}>
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <Card.Body className="p-4 p-md-5">
                <div className="mb-4">
                  <h2 className="fw-bold mb-2" style={{ color: "#1e293b" }}>
                    Send Us a Message
                  </h2>
                  <p className="text-muted mb-0">
                    Fill out the form below and our team will get back to you
                    within 24 hours.
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label
                          className="fw-semibold mb-2"
                          style={{ fontSize: "14px", color: "#475569" }}
                        >
                          Your Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="py-3"
                          style={{
                            fontSize: "14px",
                            borderRadius: "12px",
                            border: "2px solid #e2e8f0",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label
                          className="fw-semibold mb-2"
                          style={{ fontSize: "14px", color: "#475569" }}
                        >
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="py-3"
                          style={{
                            fontSize: "14px",
                            borderRadius: "12px",
                            border: "2px solid #e2e8f0",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label
                      className="fw-semibold mb-2"
                      style={{ fontSize: "14px", color: "#475569" }}
                    >
                      Subject
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="py-3"
                      style={{
                        fontSize: "14px",
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label
                      className="fw-semibold mb-2"
                      style={{ fontSize: "14px", color: "#475569" }}
                    >
                      Your Message
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      style={{
                        fontSize: "14px",
                        borderRadius: "12px",
                        border: "2px solid #e2e8f0",
                      }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 fw-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "15px",
                    }}
                  >
                    {loading ? "Sending..." : "Send Message"}{" "}
                    <FaPaperPlane className="ms-2" />
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Info */}
          <Col lg={4}>
            <div className="mb-4">
              <Card
                className="border-0 shadow-sm text-center"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body className="p-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                      borderRadius: "16px",
                    }}
                  >
                    <FaEnvelope size={24} color="white" />
                  </div>
                  <h5 className="fw-bold mb-2">Email Us</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                    support@premiumlms.com
                  </p>
                </Card.Body>
              </Card>
            </div>

            <div className="mb-4">
              <Card
                className="border-0 shadow-sm text-center"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body className="p-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                      borderRadius: "16px",
                    }}
                  >
                    <FaPhone size={24} color="white" />
                  </div>
                  <h5 className="fw-bold mb-2">Call Us</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                    +1 (234) 567-890
                  </p>
                </Card.Body>
              </Card>
            </div>

            <div className="mb-4">
              <Card
                className="border-0 shadow-sm text-center"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body className="p-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      background:
                        "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                      borderRadius: "16px",
                    }}
                  >
                    <FaMapMarkerAlt size={24} color="white" />
                  </div>
                  <h5 className="fw-bold mb-2">Visit Us</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                    123 Learning Street
                    <br />
                    Education City, NY 10001
                  </p>
                </Card.Body>
              </Card>
            </div>

            <div>
              <Card
                className="border-0 shadow-sm text-center"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body className="p-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      background:
                        "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                      borderRadius: "16px",
                    }}
                  >
                    <FaClock size={24} color="white" />
                  </div>
                  <h5 className="fw-bold mb-2">Working Hours</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                    Mon - Fri: 9AM - 6PM
                    <br />
                    Sat - Sun: 10AM - 4PM
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mt-5 pt-4">
          <Col lg={12}>
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
                Frequently Asked Questions
              </h2>
              <p className="text-muted">
                Quick answers to common questions about our platform
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: "16px" }}
            >
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3" style={{ color: "#2563eb" }}>
                  How do I enroll in a course?
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                  Simply browse our course catalog, select the course you're
                  interested in, and click the "Enroll Now" button. You'll need
                  to create an account if you haven't already.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: "16px" }}
            >
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3" style={{ color: "#8b5cf6" }}>
                  What payment methods do you accept?
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                  We accept all major credit cards, debit cards, and popular
                  digital payment methods through our secure Razorpay
                  integration.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: "16px" }}
            >
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3" style={{ color: "#ec4899" }}>
                  Can I get a refund?
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                  Yes! We offer a 30-day money-back guarantee. If you're not
                  satisfied with your purchase, contact us within 30 days for a
                  full refund.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: "16px" }}
            >
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3" style={{ color: "#10b981" }}>
                  Do you provide certificates?
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                  Absolutely! Upon successful completion of a course, you'll
                  receive a verified digital certificate that you can share on
                  LinkedIn and your resume.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
