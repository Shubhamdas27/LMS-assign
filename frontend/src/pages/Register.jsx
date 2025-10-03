import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaGraduationCap,
  FaCheckCircle,
} from "react-icons/fa";
import { register as registerService } from "../services/auth";
import { useAuth } from "../context/AuthContext";

/**
 * Premium Register Page
 */
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { updateUser, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Add body class for auth page styling
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await registerService({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Update auth context with user data
      updateUser(response.user);

      toast.success(`Welcome to LMS, ${response.user.name}!`);

      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Row>
              <Col lg={5} className="d-none d-lg-flex align-items-center">
                <div className="animate-fadeUp">
                  <h2
                    className="fw-bold mb-4"
                    style={{ color: "#1e293b", fontSize: "2rem" }}
                  >
                    Start Your Learning Journey
                  </h2>
                  <div className="mb-2" style={{ fontSize: "14px" }}>
                    <FaCheckCircle
                      className="me-2"
                      style={{ color: "#2563eb" }}
                    />
                    <span style={{ color: "#475569" }}>
                      Access 500+ premium courses
                    </span>
                  </div>
                  <div className="mb-2" style={{ fontSize: "14px" }}>
                    <FaCheckCircle
                      className="me-2"
                      style={{ color: "#2563eb" }}
                    />
                    <span style={{ color: "#475569" }}>
                      AI-powered learning assistance
                    </span>
                  </div>
                  <div className="mb-2" style={{ fontSize: "14px" }}>
                    <FaCheckCircle
                      className="me-2"
                      style={{ color: "#2563eb" }}
                    />
                    <span style={{ color: "#475569" }}>
                      Expert instructor support
                    </span>
                  </div>
                  <div className="mb-2" style={{ fontSize: "14px" }}>
                    <FaCheckCircle
                      className="me-2"
                      style={{ color: "#2563eb" }}
                    />
                    <span style={{ color: "#475569" }}>
                      Verified certificates
                    </span>
                  </div>
                </div>
              </Col>

              <Col lg={7}>
                <div
                  className="modern-card border-0 animate-slideUp"
                  style={{ maxWidth: "520px", margin: "0 auto" }}
                >
                  <div className="text-center mb-4">
                    <div
                      className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        fontSize: "1.6rem",
                        background:
                          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                        borderRadius: "16px",
                        color: "white",
                      }}
                    >
                      <FaGraduationCap />
                    </div>
                    <h3 className="fw-bold mb-2" style={{ fontSize: "1.5rem" }}>
                      Create Account
                    </h3>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      Join thousands of learners worldwide
                    </p>
                  </div>

                  {error && (
                    <Alert
                      variant="danger"
                      className="mb-4"
                      style={{ borderRadius: "12px" }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            className="fw-semibold mb-2"
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <FaUser
                              className="me-2"
                              style={{
                                color: "var(--color-secondary)",
                                fontSize: "12px",
                              }}
                            />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="py-2 px-3"
                            style={{ fontSize: "14px", borderRadius: "10px" }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label
                        className="fw-semibold mb-2"
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <FaEnvelope
                          className="me-2"
                          style={{
                            color: "var(--color-secondary)",
                            fontSize: "12px",
                          }}
                        />
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="py-2 px-3"
                        style={{ fontSize: "14px", borderRadius: "10px" }}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            className="fw-semibold mb-2"
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <FaLock
                              className="me-2"
                              style={{
                                color: "var(--color-secondary)",
                                fontSize: "12px",
                              }}
                            />
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="py-2 px-3"
                            style={{ fontSize: "14px", borderRadius: "10px" }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label
                            className="fw-semibold mb-2"
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <FaLock
                              className="me-2"
                              style={{
                                color: "var(--color-secondary)",
                                fontSize: "12px",
                              }}
                            />
                            Confirm Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="py-2 px-3"
                            style={{ fontSize: "14px", borderRadius: "10px" }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-100 mb-3"
                      style={{
                        padding: "11px",
                        fontSize: "14px",
                        fontWeight: 600,
                        borderRadius: "10px",
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account <FaArrowRight className="ms-2" />
                        </>
                      )}
                    </Button>

                    <p
                      className="text-muted text-center mb-0"
                      style={{ fontSize: "11px" }}
                    >
                      By signing up, you agree to our Terms & Privacy Policy
                    </p>
                  </Form>

                  <div
                    className="text-center mt-3 pt-3"
                    style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="fw-semibold text-decoration-none"
                        style={{ color: "var(--color-secondary)" }}
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
