import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  FaUserTie,
  FaUsers,
  FaClock,
  FaPlay,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PaymentModal from "../components/PaymentModal";

/**
 * Course Detail Page
 */
const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.course);

      // Check if user is enrolled
      if (isAuthenticated && user) {
        setIsEnrolled(
          user.enrolledCourses?.some((c) => c._id === id || c === id)
        );
      }
    } catch (error) {
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      toast.info("Please login to enroll in this course");
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate(`/learning/${id}`);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setIsEnrolled(true);
    setShowPaymentModal(false);
    navigate(`/learning/${id}`);
  };

  if (loading) {
    return (
      <div
        style={{ marginTop: "70px", minHeight: "100vh" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Spinner animation="border" style={{ color: "#4F46E5" }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div
        style={{ marginTop: "70px", minHeight: "100vh" }}
        className="d-flex justify-content-center align-items-center"
      >
        <h4>Course not found</h4>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "70px",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Container className="py-5">
        <Row>
          {/* Main Content */}
          <Col lg={8}>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="img-fluid rounded shadow mb-4"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />

            <h1 className="mb-3">{course.title}</h1>

            <div className="d-flex align-items-center gap-3 mb-4 text-muted">
              <span className="d-flex align-items-center">
                <FaUserTie className="me-2" />
                {course.instructor?.name}
              </span>
              <span className="d-flex align-items-center">
                <FaUsers className="me-2" />
                {course.totalStudents} students
              </span>
              <Badge bg="success">{course.level}</Badge>
            </div>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h5>About This Course</h5>
                <p className="text-muted">{course.description}</p>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Course Content</h5>
                <ListGroup variant="flush">
                  {course.sections?.map((section, index) => (
                    <ListGroup.Item key={section._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">
                            Section {index + 1}: {section.title}
                          </h6>
                          <small className="text-muted">
                            {section.videos?.length || 0} videos ·{" "}
                            {section.documents?.length || 0} documents
                          </small>
                        </div>
                      </div>

                      {isEnrolled && (
                        <div className="mt-2">
                          {section.videos?.map((video) => (
                            <div
                              key={video._id}
                              className="ms-3 my-1 small text-muted"
                            >
                              <FaPlay className="me-2" size={10} />
                              {video.title}{" "}
                              {video.duration && `(${video.duration})`}
                            </div>
                          ))}
                          {section.documents?.map((doc) => (
                            <div
                              key={doc._id}
                              className="ms-3 my-1 small text-muted"
                            >
                              <FaFileAlt className="me-2" size={10} />
                              {doc.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <Card className="shadow sticky-top" style={{ top: "90px" }}>
              <Card.Body>
                <h3 className="text-center mb-3" style={{ color: "#4F46E5" }}>
                  ₹{course.price}
                </h3>

                <Button
                  className="w-100 mb-3"
                  size="lg"
                  style={{ backgroundColor: "#4F46E5" }}
                  onClick={handleEnrollClick}
                >
                  {isEnrolled ? (
                    <>
                      <FaCheckCircle className="me-2" />
                      Go to Course
                    </>
                  ) : (
                    "Enroll Now"
                  )}
                </Button>

                {isEnrolled && (
                  <div className="alert alert-success text-center small mb-3">
                    <FaCheckCircle className="me-2" />
                    You are enrolled in this course
                  </div>
                )}

                <hr />

                <h6 className="mb-3">This course includes:</h6>
                <ul className="list-unstyled small">
                  <li className="mb-2">
                    <FaClock className="me-2" />
                    {course.duration || "Self-paced learning"}
                  </li>
                  <li className="mb-2">
                    <FaPlay className="me-2" />
                    {course.sections?.reduce(
                      (acc, s) => acc + (s.videos?.length || 0),
                      0
                    )}{" "}
                    video lectures
                  </li>
                  <li className="mb-2">
                    <FaFileAlt className="me-2" />
                    {course.sections?.reduce(
                      (acc, s) => acc + (s.documents?.length || 0),
                      0
                    )}{" "}
                    downloadable resources
                  </li>
                  <li className="mb-2">
                    <FaCheckCircle className="me-2" />
                    Certificate of completion
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Payment Modal */}
      {course && (
        <PaymentModal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          course={course}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CourseDetail;
