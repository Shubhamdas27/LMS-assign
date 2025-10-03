import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Tabs,
  Button,
  Table,
  Spinner,
  Form,
  Modal,
} from "react-bootstrap";
import {
  FaUsers,
  FaBook,
  FaDollarSign,
  FaPlus,
  FaPlay,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Admin Panel
 * Full admin dashboard with course, section, video, document management
 */
const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ courses: 0, students: 0, revenue: 0 });
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 500,
    thumbnail: "",
    category: "Programming",
    level: "Beginner",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, paymentsRes] = await Promise.all([
        api.get("/courses?limit=100"),
        api.get("/payment/all"),
      ]);

      setCourses(coursesRes.data.courses);
      setPayments(paymentsRes.data.payments);

      setStats({
        courses: coursesRes.data.courses.length,
        students: coursesRes.data.courses.reduce(
          (sum, c) => sum + c.totalStudents,
          0
        ),
        revenue: paymentsRes.data.totalRevenue || 0,
      });
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const response = await api.post("/courses", newCourse);
      if (response.data.success) {
        toast.success("Course created successfully!");
        setShowCourseModal(false);
        fetchData();
        setNewCourse({
          title: "",
          description: "",
          price: 500,
          thumbnail: "",
          category: "Programming",
          level: "Beginner",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${courseId}`);
      toast.success("Course deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handleManageCourse = (courseId) => {
    // Navigate to course management page (you can create this later)
    navigate(`/admin/courses/${courseId}/manage`);
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

  return (
    <div
      style={{
        marginTop: "70px",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      <div className="bg-dark text-white py-4">
        <Container>
          <h2
            className="text-white mb-2"
            style={{ color: "#ffffff", fontWeight: "600" }}
          >
            Admin Dashboard
          </h2>
          <p className="mb-0 text-white-50">Manage your LMS platform</p>
        </Container>
      </div>

      <Container className="py-4">
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <FaBook
                  size={40}
                  style={{ color: "#4F46E5" }}
                  className="mb-2"
                />
                <h3>{stats.courses}</h3>
                <p className="text-muted mb-0">Total Courses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <FaUsers
                  size={40}
                  style={{ color: "#10B981" }}
                  className="mb-2"
                />
                <h3>{stats.students}</h3>
                <p className="text-muted mb-0">Total Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <FaDollarSign
                  size={40}
                  style={{ color: "#EF4444" }}
                  className="mb-2"
                />
                <h3>₹{stats.revenue}</h3>
                <p className="text-muted mb-0">Total Revenue</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs for Management */}
        <Card className="shadow-sm">
          <Card.Body>
            <Tabs defaultActiveKey="courses" className="mb-3">
              {/* Courses Tab */}
              <Tab eventKey="courses" title="Courses">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>All Courses</h5>
                  <Button
                    style={{ backgroundColor: "#4F46E5" }}
                    onClick={() => setShowCourseModal(true)}
                  >
                    <FaPlus className="me-2" />
                    Add New Course
                  </Button>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Price</th>
                      <th>Students</th>
                      <th>Level</th>
                      <th>Content</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td>{course.title}</td>
                        <td>₹{course.price}</td>
                        <td>{course.totalStudents}</td>
                        <td>
                          <span className="badge bg-success">
                            {course.level}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            <FaPlay size={10} className="me-1" />
                            {course.sections?.reduce(
                              (total, section) =>
                                total + (section.videos?.length || 0),
                              0
                            ) || 0}{" "}
                            videos
                            <br />
                            <FaFileAlt size={10} className="me-1" />
                            {course.sections?.reduce(
                              (total, section) =>
                                total + (section.documents?.length || 0),
                              0
                            ) || 0}{" "}
                            docs
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => navigate(`/courses/${course._id}`)}
                              title="View Course"
                            >
                              <FaBook size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() =>
                                navigate(`/learning/${course._id}`)
                              }
                              title="Access Videos & Content"
                            >
                              <FaPlay size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleManageCourse(course._id)}
                              title="Manage Content"
                            >
                              <FaCog size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDeleteCourse(course._id)}
                              title="Delete Course"
                            >
                              ×
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>

              {/* Payments Tab */}
              <Tab eventKey="payments" title="Payments">
                <h5 className="mb-3">Recent Payments</h5>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Course</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 20).map((payment) => (
                      <tr key={payment._id}>
                        <td>{payment.user?.name}</td>
                        <td>{payment.course?.title}</td>
                        <td>₹{payment.amount}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              payment.status === "completed"
                                ? "success"
                                : payment.status === "failed"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>

      {/* Create Course Modal */}
      <Modal
        show={showCourseModal}
        onHide={() => setShowCourseModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                placeholder="Enter course title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="Enter course description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newCourse.price}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    value={newCourse.level}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, level: e.target.value })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail URL</Form.Label>
              <Form.Control
                type="url"
                value={newCourse.thumbnail}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, thumbnail: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCourseModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#4F46E5" }}
            onClick={handleCreateCourse}
          >
            Create Course
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
