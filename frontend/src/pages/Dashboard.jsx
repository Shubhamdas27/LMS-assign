import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Button,
  Badge,
  Tabs,
  Tab,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import api from "../services/api";
import {
  FaBook,
  FaClock,
  FaTrophy,
  FaChartLine,
  FaPlay,
  FaFilter,
} from "react-icons/fa";

/**
 * Student Dashboard
 * Shows enrolled courses with progress
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);

      // First try to get enrolled courses
      try {
        const response = await api.get("/courses/my-courses");
        if (response.data.courses && response.data.courses.length > 0) {
          setCourses(response.data.courses);
          console.log(
            "📚 Loaded enrolled courses:",
            response.data.courses.length
          );
          return;
        }
      } catch (enrolledError) {
        console.log(
          "ℹ️ No enrolled courses found, showing all available courses"
        );
      }

      // If no enrolled courses, show all available courses
      const allCoursesResponse = await api.get("/courses");
      const allCourses = allCoursesResponse.data.courses || [];

      // Add progress: 0 for all courses since user hasn't enrolled
      const coursesWithProgress = allCourses.map((course) => ({
        ...course,
        progress: 0,
        isEnrolled: false,
      }));

      setCourses(coursesWithProgress);
      console.log(
        "📚 Loaded all available courses:",
        coursesWithProgress.length
      );
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load courses");
      setCourses([]); // Set empty array instead of leaving undefined
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const progress = course.progress || 0;
    if (filter === "beginner") return course.level === "Beginner";
    if (filter === "intermediate") return course.level === "Intermediate";
    if (filter === "advanced") return course.level === "Advanced";
    return true;
  });

  const stats = {
    total: courses.length,
    inProgress: courses.filter(
      (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
    ).length,
    completed: courses.filter((c) => (c.progress || 0) === 100).length,
    totalHours: courses.reduce((sum, c) => {
      const duration = parseFloat(c.duration) || 0;
      return sum + duration;
    }, 0),
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "20px" }}>
      {/* Hero Section */}
      <div
        className="dashboard-hero"
        style={{
          background:
            "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
          padding: "50px 0 80px 0",
          position: "relative",
          overflow: "hidden",
          marginBottom: "-50px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        ></div>

        <Container style={{ position: "relative", zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#fff",
                  marginBottom: "12px",
                  textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                Find Your Next Big Opportunity to Grow
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.95)",
                  marginBottom: "0",
                  fontWeight: "400",
                }}
              >
                Welcome back, {user?.name}! Continue your learning journey
              </p>
            </Col>
            <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
              <div className="d-flex gap-2 justify-content-lg-end">
                <Button
                  style={{
                    background: "#fff",
                    border: "none",
                    color: "#047857",
                    borderRadius: "12px",
                    padding: "10px 24px",
                    fontSize: "14px",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <FaPlay className="me-2" style={{ fontSize: "12px" }} />
                  Continue Learning
                </Button>
              </div>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row className="mt-4 g-3">
            <Col xs={6} lg={3}>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#fff",
                    marginBottom: "4px",
                  }}
                >
                  {stats.total}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: "500",
                  }}
                >
                  Total Courses
                </div>
              </div>
            </Col>
            <Col xs={6} lg={3}>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#fff",
                    marginBottom: "4px",
                  }}
                >
                  {stats.inProgress}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: "500",
                  }}
                >
                  In Progress
                </div>
              </div>
            </Col>
            <Col xs={6} lg={3}>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#fff",
                    marginBottom: "4px",
                  }}
                >
                  {stats.completed}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: "500",
                  }}
                >
                  Completed
                </div>
              </div>
            </Col>
            <Col xs={6} lg={3}>
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#fff",
                    marginBottom: "4px",
                  }}
                >
                  {(stats.totalHours || 0).toFixed(1)}h
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: "500",
                  }}
                >
                  Learning Time
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container style={{ paddingTop: "70px", paddingBottom: "60px" }}>
        {loading ? (
          <div
            className="text-center py-5"
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #10b981",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "20px",
              }}
            ></div>
            <div
              style={{
                color: "#6b7280",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Loading your courses...
            </div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-5">
            <div
              style={{
                maxWidth: "500px",
                margin: "0 auto",
                padding: "60px 30px",
                background: "rgba(255,255,255,0.95)",
                borderRadius: "24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              <FaBook
                style={{
                  fontSize: "64px",
                  color: "#10b981",
                  marginBottom: "20px",
                }}
              />
              <h4
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "12px",
                }}
              >
                No enrolled courses yet
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "24px",
                }}
              >
                Browse our courses and start learning today!
              </p>
              <Button
                href="/courses"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 32px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                }}
              >
                Explore Courses
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                >
                  Our Top Free Courses
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "0",
                  }}
                >
                  {filteredCourses.length} courses available
                </p>
              </div>

              <div className="d-flex gap-2">
                <Button
                  onClick={() => setFilter("all")}
                  style={{
                    background: filter === "all" ? "#10b981" : "#fff",
                    color: filter === "all" ? "#fff" : "#374151",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "8px 18px",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                >
                  Free
                </Button>
                <Button
                  onClick={() => setFilter("beginner")}
                  style={{
                    background: filter === "beginner" ? "#10b981" : "#fff",
                    color: filter === "beginner" ? "#fff" : "#374151",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "8px 18px",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                >
                  Paid
                </Button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="mb-4 d-flex gap-2 flex-wrap">
              <Badge
                pill
                style={{
                  background: "#10b981",
                  color: "#fff",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: "500",
                  borderRadius: "24px",
                  border: "2px solid #10b981",
                }}
              >
                <FaBook className="me-2" style={{ fontSize: "11px" }} />
                Data Science
              </Badge>
              <Badge
                pill
                style={{
                  background: "#fff",
                  color: "#374151",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: "500",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                }}
              >
                Finance
              </Badge>
              <Badge
                pill
                style={{
                  background: "#fff",
                  color: "#374151",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: "500",
                  borderRadius: "24px",
                  border: "1px solid #e5e7eb",
                }}
              >
                AI & ML
              </Badge>
            </div>

            {/* Course Grid */}
            <Row className="g-4">
              {filteredCourses.map((course) => (
                <Col xs={12} md={6} lg={6} key={course._id}>
                  <CourseCard
                    course={course}
                    showProgress={true}
                    progress={course.progress || 0}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
