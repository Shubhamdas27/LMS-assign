import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  FaSearch,
  FaGraduationCap,
  FaUsers,
  FaStar,
  FaBookOpen,
} from "react-icons/fa";
import CourseCard from "../components/CourseCard";
import api from "../services/api";
import { PLATFORM_STATS } from "../config/constants";

/**
 * Courses Listing Page - Premium Design
 */
const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses?limit=50");
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section - Matching About Us Style */}
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
            <Col lg={7} data-aos="fade-up">
              {/* Badge */}
              <div className="mb-2">
                <span
                  className="d-inline-flex align-items-center animate-pulse-subtle"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "50px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                >
                  <FaBookOpen className="me-2" size={14} />
                  {PLATFORM_STATS.courses.count} Premium Courses
                </span>
              </div>

              {/* Title */}
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
                Explore{" "}
                <span className="text-gradient-yellow">Premium Courses</span>
              </h1>

              {/* Description */}
              <p
                className="mb-3"
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  maxWidth: "560px",
                }}
              >
                Discover your next learning adventure with expert-led courses
                and industry-recognized certifications
              </p>

              {/* Search Bar */}
              <InputGroup
                className="mt-3"
                style={{ maxWidth: "500px" }}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <InputGroup.Text
                  style={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px 0 0 12px",
                    padding: "12px 16px",
                  }}
                >
                  <FaSearch style={{ color: "#6b7280" }} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: "none",
                    borderRadius: "0 12px 12px 0",
                    padding: "12px 16px",
                    fontSize: "15px",
                  }}
                />
              </InputGroup>

              {/* Stats Row */}
              <Row className="g-2 mt-3" data-aos="fade-up" data-aos-delay="300">
                <Col xs={4}>
                  <div style={{ color: "white" }}>
                    <FaUsers
                      size={18}
                      className="mb-1"
                      style={{ color: "#60a5fa" }}
                    />
                    <h4 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
                      {PLATFORM_STATS.students.count}
                    </h4>
                    <p
                      className="mb-0"
                      style={{ fontSize: "12px", opacity: 0.9 }}
                    >
                      Students
                    </p>
                  </div>
                </Col>
                <Col xs={4}>
                  <div style={{ color: "white" }}>
                    <FaGraduationCap
                      size={18}
                      className="mb-1"
                      style={{ color: "#a78bfa" }}
                    />
                    <h4 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
                      {PLATFORM_STATS.courses.count}
                    </h4>
                    <p
                      className="mb-0"
                      style={{ fontSize: "12px", opacity: 0.9 }}
                    >
                      Courses
                    </p>
                  </div>
                </Col>
                <Col xs={4}>
                  <div style={{ color: "white" }}>
                    <FaStar
                      size={18}
                      className="mb-1"
                      style={{ color: "#fbbf24" }}
                    />
                    <h4 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
                      98%
                    </h4>
                    <p
                      className="mb-0"
                      style={{ fontSize: "12px", opacity: 0.9 }}
                    >
                      Satisfaction
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>

            {/* Right Side - Icon */}
            <Col
              lg={5}
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

      {/* Courses Section */}
      <section className="py-3 bg-light">
        <Container className="py-3">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#4F46E5" }} />
              <p className="mt-3 text-muted">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted">No courses found</h4>
              <p>Try adjusting your search</p>
            </div>
          ) : (
            <>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <h5 className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                  <Badge
                    bg="primary"
                    style={{
                      fontSize: "13px",
                      padding: "6px 12px",
                      fontWeight: 500,
                    }}
                  >
                    {filteredCourses.length}{" "}
                    {filteredCourses.length === 1 ? "Course" : "Courses"}{" "}
                    Available
                  </Badge>
                </h5>
              </div>

              <Row className="g-3">
                {filteredCourses.map((course) => (
                  <Col md={6} lg={4} key={course._id}>
                    <CourseCard course={course} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Container>
      </section>
    </div>
  );
};

export default CoursePage;
