import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaRocket,
  FaUsers,
  FaBrain,
  FaGlobe,
  FaHeart,
  FaLightbulb,
  FaGraduationCap,
  FaStar,
  FaAward,
  FaChartLine,
} from "react-icons/fa";
import {
  COMPANY_INFO,
  PLATFORM_STATS,
  MISSION_VISION,
  CORE_VALUES,
} from "../config/constants";

/**
 * About Us Page - Dynamic content from constants
 */
const AboutUs = () => {
  // Icon mapping for dynamic icon rendering
  const iconMap = {
    FaRocket,
    FaUsers,
    FaBrain,
    FaGlobe,
    FaHeart,
    FaLightbulb,
    FaStar,
  };

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section
        className="hero-gradient position-relative overflow-hidden"
        style={{
          paddingTop: "80px",
          paddingBottom: "40px",
          minHeight: "50vh",
        }}
      >
        <Container className="position-relative" style={{ zIndex: 2 }}>
          <Row className="align-items-center g-3">
            <Col lg={6} data-aos="fade-up">
              <div className="mb-2">
                <span
                  className="d-inline-flex align-items-center animate-pulse-subtle"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                >
                  {COMPANY_INFO.tagline}
                </span>
              </div>
              <h1
                className="fw-bold mb-2"
                style={{
                  fontSize: "2.5rem",
                  color: "white",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                About{" "}
                <span className="text-gradient-yellow">
                  {COMPANY_INFO.name}
                </span>
              </h1>
              <p
                className="lead mb-3"
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  maxWidth: "560px",
                }}
              >
                {MISSION_VISION.mission.description}
              </p>

              {/* Stats Cards */}
              <Row className="g-2">
                <Col xs={4}>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      className="fw-bold mb-1"
                      style={{ color: "white", fontSize: "1.5rem" }}
                    >
                      {PLATFORM_STATS.students.count}
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "12px",
                      }}
                    >
                      Students
                    </p>
                  </div>
                </Col>
                <Col xs={4}>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      className="fw-bold mb-1"
                      style={{ color: "white", fontSize: "1.5rem" }}
                    >
                      {PLATFORM_STATS.courses.count}
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "12px",
                      }}
                    >
                      Courses
                    </p>
                  </div>
                </Col>
                <Col xs={4}>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(20px)",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      textAlign: "center",
                    }}
                  >
                    <h3
                      className="fw-bold mb-1"
                      style={{ color: "white", fontSize: "1.5rem" }}
                    >
                      {PLATFORM_STATS.instructors.count}
                    </h3>
                    <p
                      className="mb-0"
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "12px",
                      }}
                    >
                      Instructors
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              lg={6}
              data-aos="fade-left"
              data-aos-delay="400"
              className="d-none d-lg-block"
            >
              <div
                className="floating-animation"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(30px)",
                  padding: "40px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  textAlign: "center",
                  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.25)",
                }}
              >
                <FaGraduationCap
                  size={100}
                  style={{ color: "rgba(255, 255, 255, 0.4)" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission Points Section */}
      <section className="py-3 bg-light">
        <Container className="py-3">
          <Row className="text-center mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3" data-aos="fade-up">
                {MISSION_VISION.mission.title}
              </h2>
              <p
                className="lead text-muted mx-auto"
                style={{ maxWidth: "700px" }}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {MISSION_VISION.vision.description}
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {MISSION_VISION.mission.points.map((point, index) => {
              const IconComponent = iconMap[point.icon];
              return (
                <Col
                  md={6}
                  lg={3}
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={100 * (index + 1)}
                >
                  <Card className="border-0 shadow-sm h-100 text-center p-3 card-hover-lift">
                    <div
                      className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "60px",
                        height: "60px",
                        background:
                          index % 2 === 0
                            ? "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)"
                            : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                        borderRadius: "20px",
                      }}
                    >
                      {IconComponent && (
                        <IconComponent size={28} color="white" />
                      )}
                    </div>
                    <Card.Body className="p-0">
                      <h5 className="fw-bold mb-2">{point.title}</h5>
                      <p className="text-muted small mb-0">
                        {point.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Core Values Section */}
      <section className="py-3" style={{ background: "#f8f9ff" }}>
        <Container className="py-3">
          <Row className="text-center mb-3">
            <Col>
              <h2 className="display-6 fw-bold mb-2" data-aos="fade-up">
                Our Core Values
              </h2>
              <p
                className="text-muted mx-auto"
                style={{ maxWidth: "700px", fontSize: "0.95rem" }}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                The principles that guide everything we do
              </p>
            </Col>
          </Row>

          <Row className="g-3 justify-content-center">
            {CORE_VALUES.map((value, index) => {
              const IconComponent = iconMap[value.icon];
              return (
                <Col
                  md={6}
                  lg={3}
                  key={index}
                  data-aos="zoom-in"
                  data-aos-delay={100 * (index + 1)}
                >
                  <Card
                    className="border-0 h-100 text-center p-3 card-hover-lift"
                    style={{
                      background: "white",
                      borderRadius: "20px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div
                      className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "55px",
                        height: "55px",
                        background: value.color,
                        borderRadius: "12px",
                        opacity: 0.9,
                      }}
                    >
                      {IconComponent && (
                        <IconComponent size={26} color="white" />
                      )}
                    </div>
                    <Card.Body className="p-0">
                      <h5
                        className="fw-bold mb-2"
                        style={{ color: value.color }}
                      >
                        {value.title}
                      </h5>
                      <p className="text-muted small mb-0">
                        {value.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Stats Banner */}
      <section
        className="py-3 text-white"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
        }}
      >
        <Container>
          <Row className="text-center g-3">
            <Col md={4} data-aos="fade-up" data-aos-delay="100">
              <FaAward size={40} className="mb-2" />
              <h2 className="fw-bold mb-1" style={{ fontSize: "1.8rem" }}>
                {PLATFORM_STATS.satisfaction.percentage}%
              </h2>
              <p className="mb-0" style={{ fontSize: "0.95rem" }}>
                {PLATFORM_STATS.satisfaction.label}
              </p>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-delay="200">
              <FaChartLine size={40} className="mb-2" />
              <h2 className="fw-bold mb-1" style={{ fontSize: "1.8rem" }}>
                {PLATFORM_STATS.completionRate.percentage}%
              </h2>
              <p className="mb-0" style={{ fontSize: "0.95rem" }}>
                {PLATFORM_STATS.completionRate.label}
              </p>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-delay="300">
              <FaGlobe size={40} className="mb-2" />
              <h2 className="fw-bold mb-1" style={{ fontSize: "1.8rem" }}>
                50+
              </h2>
              <p className="mb-0" style={{ fontSize: "0.95rem" }}>
                Countries Worldwide
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
