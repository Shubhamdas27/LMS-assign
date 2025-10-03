import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaRocket,
  FaGraduationCap,
  FaBrain,
  FaCreditCard,
  FaChartLine,
  FaCertificate,
  FaUsers,
  FaClock,
  FaStar,
  FaArrowRight,
  FaLightbulb,
  FaGlobe,
  FaHeart,
  FaCheckCircle,
  FaPlay,
} from "react-icons/fa";
import CourseCard from "../components/CourseCard";
import api from "../services/api";
import {
  COMPANY_INFO,
  PLATFORM_STATS,
  TRUST_BADGES,
  FEATURES,
} from "../config/constants";

/**
 * Premium Home Page with Vision & Modern Design
 */
const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses?limit=6");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Premium Hero Section - Imarticus Style */}
      <section
        className="hero-gradient position-relative overflow-hidden"
        style={{
          paddingTop: "80px",
          paddingBottom: "50px",
          minHeight: "70vh",
        }}
      >
        {/* Animated Background Elements */}
        <div className="hero-bg-shapes">
          <div className="shape-1"></div>
          <div className="shape-2"></div>
          <div className="shape-3"></div>
        </div>

        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="align-items-center g-5">
            {/* Left Content */}
            <Col lg={6} data-aos="fade-up" data-aos-duration="800">
              <div className="hero-content">
                {/* Badge */}
                <div className="mb-4" data-aos="fade-down" data-aos-delay="100">
                  <span
                    className="hero-badge d-inline-flex align-items-center animate-pulse-subtle"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      color: "white",
                      padding: "10px 24px",
                      borderRadius: "50px",
                      fontSize: "13px",
                      fontWeight: 600,
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <FaStar
                      className="me-2 animate-spin-slow"
                      size={14}
                      style={{ color: "#fbbf24" }}
                    />
                    #1 AI-Powered Learning Platform
                  </span>
                </div>

                {/* Headline with Gradient Text */}
                <h1
                  className="display-4 fw-bold mb-3 hero-title"
                  style={{
                    lineHeight: "1.15",
                    color: "white",
                    letterSpacing: "-0.02em",
                  }}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Transform Your Future
                  <br />
                  <span className="text-gradient-white">With Premium</span>{" "}
                  <span className="text-gradient-yellow">Learning</span>
                </h1>

                {/* Description */}
                <p
                  className="lead mb-3"
                  style={{
                    fontSize: "1rem",
                    color: "rgba(255, 255, 255, 0.95)",
                    lineHeight: "1.6",
                    maxWidth: "560px",
                    fontWeight: 400,
                  }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  Master new skills with expert-led courses, AI-powered learning
                  paths, and industry-recognized certifications trusted by
                  10,000+ students worldwide.
                </p>

                {/* Trust Badges */}
                <div
                  className="d-flex align-items-center gap-3 mb-4"
                  data-aos="fade-up"
                  data-aos-delay="350"
                >
                  {TRUST_BADGES.map((badge, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center"
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <FaCheckCircle
                        size={16}
                        className="me-2"
                        style={{ color: badge.color }}
                      />
                      {badge.text}
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div
                  className="d-flex gap-3 mb-3 flex-wrap"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <Button
                    as={Link}
                    to="/courses"
                    size="lg"
                    className="btn-hero-primary d-inline-flex align-items-center"
                    style={{
                      background: "white",
                      color: "#2563eb",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "14px 32px",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    Explore Courses <FaArrowRight className="ms-2" size={16} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline-light"
                    className="btn-hero-secondary d-inline-flex align-items-center"
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "14px 32px",
                      borderRadius: "12px",
                      borderWidth: "2px",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <FaPlay className="me-2" size={14} /> Watch Demo
                  </Button>
                </div>

                {/* Stats Row */}
                <Row
                  className="g-3 mt-2"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <Col xs={4}>
                    <div className="stat-item">
                      <div className="d-flex align-items-center mb-1">
                        <FaUsers
                          size={20}
                          style={{ color: "#60a5fa" }}
                          className="me-2"
                        />
                      </div>
                      <h3
                        className="fw-bold mb-0"
                        style={{ color: "white", fontSize: "1.6rem" }}
                      >
                        {PLATFORM_STATS.students.count}
                      </h3>
                      <p
                        className="mb-0"
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "13px",
                        }}
                      >
                        {PLATFORM_STATS.students.label}
                      </p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item">
                      <div className="d-flex align-items-center mb-1">
                        <FaGraduationCap
                          size={20}
                          style={{ color: "#a78bfa" }}
                          className="me-2"
                        />
                      </div>
                      <h3
                        className="fw-bold mb-0"
                        style={{ color: "white", fontSize: "1.6rem" }}
                      >
                        {PLATFORM_STATS.courses.count}
                      </h3>
                      <p
                        className="mb-0"
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "13px",
                        }}
                      >
                        {PLATFORM_STATS.courses.label}
                      </p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item">
                      <div className="d-flex align-items-center mb-1">
                        <FaCertificate
                          size={20}
                          style={{ color: "#fbbf24" }}
                          className="me-2"
                        />
                      </div>
                      <h3
                        className="fw-bold mb-0"
                        style={{ color: "white", fontSize: "1.6rem" }}
                      >
                        {PLATFORM_STATS.instructors.count}
                      </h3>
                      <p
                        className="mb-0"
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "13px",
                        }}
                      >
                        {PLATFORM_STATS.instructors.label}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Right Content - Illustration & Progress Card */}
            <Col
              lg={6}
              className="d-none d-lg-block"
              data-aos="fade-left"
              data-aos-delay="400"
              data-aos-duration="800"
            >
              <div className="hero-visual position-relative">
                {/* Main Illustration/Image Placeholder */}
                <div
                  className="hero-image-container floating-animation"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                    borderRadius: "28px",
                    padding: "48px",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    boxShadow:
                      "0 24px 80px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div
                    className="text-center position-relative"
                    style={{
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                      borderRadius: "20px",
                      padding: "90px 70px",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)",
                    }}
                  >
                    {/* Animated Decorative elements */}
                    <div
                      className="animate-pulse-subtle"
                      style={{
                        position: "absolute",
                        top: "30px",
                        right: "30px",
                        width: "70px",
                        height: "70px",
                        background: "rgba(255, 255, 255, 0.15)",
                        borderRadius: "50%",
                        animation: "float 4s ease-in-out infinite",
                      }}
                    ></div>
                    <div
                      className="animate-pulse-subtle"
                      style={{
                        position: "absolute",
                        bottom: "30px",
                        left: "30px",
                        width: "90px",
                        height: "90px",
                        background: "rgba(255, 255, 255, 0.12)",
                        borderRadius: "50%",
                        animation: "float 6s ease-in-out infinite reverse",
                      }}
                    ></div>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "15%",
                        width: "50px",
                        height: "50px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                        animation: "float 5s ease-in-out infinite",
                      }}
                    ></div>

                    <div className="position-relative" style={{ zIndex: 2 }}>
                      <FaGraduationCap
                        size={90}
                        color="white"
                        className="mb-4"
                        style={{
                          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
                        }}
                      />
                      <h4
                        className="text-white fw-bold mb-2"
                        style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}
                      >
                        Premium Learning
                      </h4>
                      <p
                        className="text-white mb-0"
                        style={{
                          opacity: 0.95,
                          fontSize: "15px",
                          fontWeight: 400,
                        }}
                      >
                        Join 10,000+ successful learners
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Card - Below Image */}
                <div
                  className="hero-progress-card mt-4"
                  style={{
                    background: "white",
                    borderRadius: "24px",
                    padding: "28px 32px",
                    boxShadow: "0 16px 50px rgba(0, 0, 0, 0.18)",
                    transform: "translateY(-20px)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "48px",
                        height: "48px",
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                        borderRadius: "12px",
                        marginRight: "16px",
                      }}
                    >
                      <FaChartLine size={22} color="white" />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ color: "#1e293b" }}>
                        Premium Courses
                      </h6>
                      <small style={{ color: "#64748b", fontSize: "13px" }}>
                        Expert-led learning paths
                      </small>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div
                    className="progress mb-2"
                    style={{
                      height: "8px",
                      borderRadius: "10px",
                      background: "#e2e8f0",
                    }}
                  >
                    <div
                      className="progress-bar progress-bar-animated"
                      role="progressbar"
                      style={{
                        width: "75%",
                        background:
                          "linear-gradient(90deg, #2563eb 0%, #8b5cf6 100%)",
                        borderRadius: "10px",
                        transition: "width 2s ease-in-out",
                      }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small style={{ color: "#64748b", fontSize: "13px" }}>
                      Completion Rate
                    </small>
                    <span
                      className="fw-bold"
                      style={{ color: "#2563eb", fontSize: "15px" }}
                    >
                      75%
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-5" style={{ marginTop: "80px" }}>
        <Container>
          <Row className="align-items-center mb-5">
            <Col lg={6} data-aos="fade-right">
              <div className="premium-card p-5">
                <FaLightbulb
                  size={60}
                  style={{ color: "#2563eb" }}
                  className="mb-4"
                />
                <h2 className="mb-4">Our Vision</h2>
                <p className="lead text-muted mb-4">
                  To democratize quality education globally and empower every
                  individual to reach their full potential through accessible,
                  AI-enhanced learning experiences.
                </p>
                <p className="text-muted">
                  We envision a world where geographical boundaries, financial
                  constraints, and time limitations no longer hinder access to
                  world-class education. By leveraging cutting-edge AI
                  technology and partnering with industry experts, we're
                  building the future of learning—one course at a time.
                </p>
                <div className="mt-4">
                  <div className="d-flex align-items-start mb-3">
                    <FaGlobe
                      size={24}
                      style={{ color: "#2563eb" }}
                      className="me-3 mt-1"
                    />
                    <div>
                      <h6 className="fw-bold mb-1">Global Reach</h6>
                      <p className="text-muted mb-0 small">
                        Making quality education accessible to learners
                        worldwide
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <FaHeart
                      size={24}
                      style={{ color: "#ec4899" }}
                      className="me-3 mt-1"
                    />
                    <div>
                      <h6 className="fw-bold mb-1">Student-Centric</h6>
                      <p className="text-muted mb-0 small">
                        Every decision we make puts our learners first
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6} data-aos="fade-left" data-aos-delay="200">
              <div className="premium-card p-5 mt-4 mt-lg-0">
                <FaRocket
                  size={60}
                  style={{ color: "#8b5cf6" }}
                  className="mb-4"
                />
                <h2 className="mb-4">Our Mission</h2>
                <p className="lead text-muted mb-4">
                  To deliver transformative learning experiences that combine
                  expert knowledge, innovative technology, and personalized
                  support to help learners achieve their goals.
                </p>
                <div className="mt-4">
                  <Row className="justify-content-center g-3">
                    <Col
                      xs={6}
                      md={3}
                      lg={3}
                      className="d-flex justify-content-center"
                    >
                      <div className="feature-card-modern text-center p-4 w-100">
                        <div
                          className="feature-icon-wrapper mb-3 mx-auto"
                          style={{
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                          }}
                        >
                          <FaBrain size={24} color="white" />
                        </div>
                        <h5
                          className="fw-bold mb-2"
                          style={{ color: "#2563eb" }}
                        >
                          AI-Powered
                        </h5>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          Smart Summaries
                        </p>
                      </div>
                    </Col>
                    <Col
                      xs={6}
                      md={3}
                      lg={3}
                      className="d-flex justify-content-center"
                    >
                      <div className="feature-card-modern text-center p-4 w-100">
                        <div
                          className="feature-icon-wrapper mb-3 mx-auto"
                          style={{
                            background:
                              "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                          }}
                        >
                          <FaClock size={24} color="white" />
                        </div>
                        <h5
                          className="fw-bold mb-2"
                          style={{ color: "#8b5cf6" }}
                        >
                          24/7
                        </h5>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          Access Anytime
                        </p>
                      </div>
                    </Col>
                    <Col
                      xs={6}
                      md={3}
                      lg={3}
                      className="d-flex justify-content-center"
                    >
                      <div className="feature-card-modern text-center p-4 w-100">
                        <div
                          className="feature-icon-wrapper mb-3 mx-auto"
                          style={{
                            background:
                              "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                          }}
                        >
                          <FaUsers size={24} color="white" />
                        </div>
                        <h5
                          className="fw-bold mb-2"
                          style={{ color: "#ec4899" }}
                        >
                          Expert
                        </h5>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          Instructors
                        </p>
                      </div>
                    </Col>
                    <Col
                      xs={6}
                      md={3}
                      lg={3}
                      className="d-flex justify-content-center"
                    >
                      <div className="feature-card-modern text-center p-4 w-100">
                        <div
                          className="feature-icon-wrapper mb-3 mx-auto"
                          style={{
                            background:
                              "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                          }}
                        >
                          <FaCertificate size={24} color="white" />
                        </div>
                        <h5
                          className="fw-bold mb-2"
                          style={{ color: "#10b981" }}
                        >
                          Certified
                        </h5>
                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "13px" }}
                        >
                          Courses
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Premium Features */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5 animate-fade-in-up">
            <h2 className="display-5 fw-bold mb-3">
              Why <span className="gradient-text">Choose Us</span>?
            </h2>
            <p className="lead text-muted">
              Experience the future of learning with our premium features
            </p>
          </div>

          <Row>
            <Col md={6} lg={3} className="mb-4 animate-fade-in-up delay-100">
              <div className="feature-card text-center hover-lift">
                <div className="feature-icon mx-auto">
                  <FaBrain />
                </div>
                <h5 className="fw-bold mb-3">AI-Powered Learning</h5>
                <p className="text-muted">
                  Get instant AI-generated summaries and personalized insights
                  using Google Gemini technology.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3} className="mb-4 animate-fade-in-up delay-200">
              <div className="feature-card text-center hover-lift">
                <div className="feature-icon mx-auto">
                  <FaChartLine />
                </div>
                <h5 className="fw-bold mb-3">Progress Tracking</h5>
                <p className="text-muted">
                  Monitor your learning journey with detailed analytics and
                  completion tracking.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3} className="mb-4 animate-fade-in-up delay-300">
              <div className="feature-card text-center hover-lift">
                <div className="feature-icon mx-auto">
                  <FaCreditCard />
                </div>
                <h5 className="fw-bold mb-3">Secure Payments</h5>
                <p className="text-muted">
                  Safe and seamless enrollment with Razorpay payment integration
                  and instant access.
                </p>
              </div>
            </Col>

            <Col md={6} lg={3} className="mb-4 animate-fade-in-up delay-400">
              <div className="feature-card text-center hover-lift">
                <div
                  className="feature-icon mx-auto"
                  style={{
                    background:
                      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  }}
                >
                  <FaCertificate />
                </div>
                <h5 className="fw-bold mb-3">Certificates</h5>
                <p className="text-muted">
                  Earn recognized certificates upon course completion to
                  showcase your skills.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Courses */}
      <section className="py-5" style={{ marginTop: "60px" }}>
        <Container>
          <div className="text-center mb-5 animate-fade-in-up">
            <h2 className="display-5 fw-bold mb-3">
              <span className="gradient-text">Featured</span> Courses
            </h2>
            <p className="lead text-muted">
              Explore our most popular courses taught by industry experts
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-premium"></div>
              <p className="mt-3 text-muted">Loading amazing courses...</p>
            </div>
          ) : (
            <>
              <Row>
                {courses.map((course, index) => (
                  <Col
                    md={6}
                    lg={4}
                    key={course._id}
                    className={`mb-4 animate-fade-in-up delay-${
                      ((index % 3) + 1) * 100
                    }`}
                  >
                    <CourseCard course={course} />
                  </Col>
                ))}
              </Row>

              <div className="text-center mt-5 animate-fade-in-up delay-500">
                <Button
                  as={Link}
                  to="/courses"
                  size="lg"
                  className="btn-premium"
                >
                  View All Courses <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      {/* Stats Section */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          marginTop: "80px",
        }}
      >
        <Container>
          <Row>
            <Col
              md={3}
              sm={6}
              className="mb-4 mb-md-0 text-center animate-scale-in"
            >
              <FaUsers
                size={50}
                style={{ color: "#667eea" }}
                className="mb-3"
              />
              <h2 className="fw-bold gradient-text mb-2">10,000+</h2>
              <p className="text-muted mb-0">Active Learners</p>
            </Col>
            <Col
              md={3}
              sm={6}
              className="mb-4 mb-md-0 text-center animate-scale-in delay-100"
            >
              <FaGraduationCap
                size={50}
                style={{ color: "#f5576c" }}
                className="mb-3"
              />
              <h2 className="fw-bold gradient-text-secondary mb-2">500+</h2>
              <p className="text-muted mb-0">Premium Courses</p>
            </Col>
            <Col
              md={3}
              sm={6}
              className="text-center animate-scale-in delay-200"
            >
              <FaCertificate
                size={50}
                style={{ color: "#4facfe" }}
                className="mb-3"
              />
              <h2 className="fw-bold gradient-text mb-2">15,000+</h2>
              <p className="text-muted mb-0">Certificates Issued</p>
            </Col>
            <Col
              md={3}
              sm={6}
              className="text-center animate-scale-in delay-300"
            >
              <FaClock
                size={50}
                style={{ color: "#fa709a" }}
                className="mb-3"
              />
              <h2 className="fw-bold gradient-text-secondary mb-2">24/7</h2>
              <p className="text-muted mb-0">Learning Support</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 my-5">
        <Container>
          <div className="premium-card p-5 text-center animate-fade-in-up">
            <div
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <h2 className="display-4 fw-bold mb-4">
                Ready to Start Your Learning Journey?
              </h2>
            </div>
            <p className="lead text-muted mb-4">
              Join thousands of learners achieving their goals with our premium
              platform
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button
                as={Link}
                to="/register"
                size="lg"
                className="btn-premium"
              >
                Get Started Today <FaArrowRight className="ms-2" />
              </Button>
              <Button
                as={Link}
                to="/courses"
                size="lg"
                className="btn-premium-outline"
              >
                Browse Courses
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
