import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaUserTie,
  FaUsers,
  FaClock,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

/**
 * Premium Course Card Component
 * Displays course information with modern styling
 */
const CourseCard = ({ course, showProgress = false, progress = 0 }) => {
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return { bg: "#d1fae5", text: "#065f46", badge: "Beginner" };
      case "intermediate":
        return { bg: "#dbeafe", text: "#1e40af", badge: "Intermediate" };
      case "advanced":
        return { bg: "#fef3c7", text: "#92400e", badge: "Advanced" };
      default:
        return { bg: "#d1fae5", text: "#065f46", badge: "Beginner" };
    }
  };

  const levelStyle = getLevelColor(course.level);

  return (
    <div className="h-100">
      <Card
        style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          transition: "all 0.3s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        className="course-card-dashboard"
      >
        {/* Course Image */}
        <div
          style={{
            width: "100%",
            height: "180px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={course.thumbnail || "https://via.placeholder.com/400x180"}
            alt={course.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Rating Badge */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#fff",
              borderRadius: "8px",
              padding: "4px 10px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: "600", color: "#1f2937" }}
            >
              {course.rating || "4.5"}
            </span>
            <FaStar style={{ fontSize: "10px", color: "#fbbf24" }} />
          </div>
        </div>

        {/* Course Content */}
        <Card.Body
          style={{
            padding: "16px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Category & Level */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <Badge
              style={{
                background: "#10b981",
                color: "#fff",
                fontSize: "10px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              {course.category || "DATA SCIENCE"}
            </Badge>
            <span
              style={{
                background: levelStyle.bg,
                color: levelStyle.text,
                fontSize: "10px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              {levelStyle.badge}
            </span>
          </div>

          {/* Course Title */}
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "8px",
              lineHeight: "1.3",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "38px",
            }}
          >
            <Link
              to={`/courses/${course._id || course.id}`}
              style={{ color: "#1f2937", textDecoration: "none" }}
            >
              {course.title}
            </Link>
          </h3>

          {/* Course Meta */}
          <div
            className="d-flex align-items-center gap-3 mb-2"
            style={{ flexWrap: "wrap" }}
          >
            {course.duration && (
              <div className="d-flex align-items-center">
                <FaClock
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    marginRight: "4px",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  {course.duration}
                </span>
              </div>
            )}
            {course.totalStudents && (
              <div className="d-flex align-items-center">
                <FaUsers
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    marginRight: "4px",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    fontWeight: "500",
                  }}
                >
                  {course.totalStudents}+
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          {course.price !== undefined && (
            <div className="mb-2">
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#10b981",
                }}
              >
                ₹{course.price}
              </span>
            </div>
          )}

          {/* Progress or Action Buttons */}
          <div style={{ marginTop: "auto" }}>
            {showProgress ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    Progress
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#1f2937",
                      fontWeight: "600",
                    }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  style={{
                    height: "5px",
                    background: "#e5e7eb",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                      width: `${progress}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    as={Link}
                    to={`/learning/${course._id || course.id}`}
                    style={{
                      background: "#047857",
                      border: "none",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      flex: 1,
                    }}
                  >
                    Continue Learning
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                as={Link}
                to={`/courses/${course._id || course.id}`}
                style={{
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  width: "100%",
                }}
              >
                View Details
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseCard;
