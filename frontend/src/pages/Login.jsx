import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaGraduationCap,
} from "react-icons/fa";
import { login as loginService } from "../services/auth";
import { useAuth } from "../context/AuthContext";

/**
 * Premium Login Page
 */
const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (
        user.name === "Demo Instructor" ||
        user.email?.includes("instructor")
      ) {
        navigate("/instructor", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

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
    setLoading(true);

    try {
      const response = await loginService(formData.email, formData.password);

      // Update auth context with user data
      updateUser(response.user);

      toast.success(`Welcome back, ${response.user.name}!`);

      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (
        response.user.name === "Demo Instructor" ||
        response.user.email.includes("instructor")
      ) {
        navigate("/instructor", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <div
              className="modern-card border-0 animate-slideUp"
              style={{ maxWidth: "480px", margin: "0 auto" }}
            >
              {/* Logo */}
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
                  Welcome Back
                </h3>
                <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                  Sign in to continue your learning journey
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
                <Form.Group className="mb-3">
                  <Form.Label
                    className="fw-semibold mb-2"
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
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
                    style={{
                      fontSize: "14px",
                      borderRadius: "10px",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label
                    className="fw-semibold mb-2"
                    style={{ fontSize: "13px", color: "var(--text-secondary)" }}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="py-2 px-3"
                    style={{
                      fontSize: "14px",
                      borderRadius: "10px",
                    }}
                  />
                  <div className="text-end mt-2">
                    <small
                      className="text-muted"
                      style={{ cursor: "pointer", fontSize: "12px" }}
                    >
                      Forgot password?
                    </small>
                  </div>
                </Form.Group>

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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <FaArrowRight className="ms-2" />
                    </>
                  )}
                </Button>
              </Form>

              <div
                className="text-center mt-3 pt-3"
                style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
              >
                <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-none"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    Sign up now
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div
                className="mt-3 p-3 rounded-3"
                style={{
                  background: "rgba(14, 165, 233, 0.05)",
                  border: "1px solid rgba(14, 165, 233, 0.1)",
                }}
              >
                <h6 className="fw-bold mb-2" style={{ fontSize: "12px" }}>
                  Demo Credentials:
                </h6>
                <div style={{ fontSize: "11px" }} className="text-muted">
                  <div className="mb-1">
                    <strong>Student:</strong> demo.student@premiumlms.com /
                    Demo@2025
                  </div>
                  <div className="mb-1">
                    <strong>Admin:</strong> demo.admin@premiumlms.com /
                    Demo@2025
                  </div>
                  <div>
                    <strong>Instructor:</strong> demo.instructor@premiumlms.com
                    / Demo@2025
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
