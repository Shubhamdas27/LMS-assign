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
  Alert,
  ProgressBar,
} from "react-bootstrap";
import {
  FaDollarSign,
  FaBook,
  FaUsers,
  FaPlus,
  FaUpload,
  FaFileAlt,
  FaPlay,
  FaChartLine,
  FaStar,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Instructor Dashboard
 * For course creators to manage content and view earnings
 */
const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalCourses: 0,
    totalStudents: 0,
    avgRating: 0,
  });
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("video"); // 'video' or 'document'
  const [uploadData, setUploadData] = useState({
    courseId: "",
    sectionId: "",
    title: "",
    description: "",
    fileUrl: "",
    duration: "",
  });

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);

      // Fetch instructor stats and data from backend
      const [statsRes, coursesRes, earningsRes] = await Promise.all([
        api.get("/instructor/stats"),
        api.get("/instructor/courses"),
        api.get("/instructor/earnings"),
      ]);

      const instructorStats = statsRes.data.stats || {};
      const instructorCourses = coursesRes.data.courses || [];
      const instructorEarnings = earningsRes.data.earnings || [];

      setCourses(instructorCourses);
      setEarnings(instructorEarnings);
      setStats(instructorStats);
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      toast.error("Failed to fetch instructor data");

      // Fallback to sample data if endpoints fail
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    // Sample data for demonstration
    const sampleCourses = [
      {
        _id: "1",
        title: "JavaScript Fundamentals",
        totalStudents: 45,
        rating: 4.5,
        earnings: 15000,
        sections: [
          { _id: "1", title: "Introduction", videos: [], documents: [] },
        ],
      },
      {
        _id: "2",
        title: "React Development",
        totalStudents: 32,
        rating: 4.7,
        earnings: 12000,
        sections: [
          { _id: "2", title: "Getting Started", videos: [], documents: [] },
        ],
      },
    ];

    setCourses(sampleCourses);
    setStats({
      totalEarnings: 27000,
      totalCourses: 2,
      totalStudents: 77,
      avgRating: 4.6,
    });
  };

  const handleFileUpload = async () => {
    try {
      const endpoint =
        uploadType === "video" ? "/videos/upload" : "/documents/upload";

      await api.post(endpoint, {
        section: uploadData.sectionId,
        title: uploadData.title,
        description: uploadData.description,
        fileUrl: uploadData.fileUrl,
        ...(uploadType === "video"
          ? { duration: uploadData.duration }
          : { fileType: "pdf" }),
      });

      toast.success(
        `${
          uploadType === "video" ? "Video" : "Document"
        } uploaded successfully!`
      );
      setShowUploadModal(false);
      setUploadData({
        courseId: "",
        sectionId: "",
        title: "",
        description: "",
        fileUrl: "",
        duration: "",
      });
      fetchInstructorData();
    } catch (error) {
      toast.error(`Failed to upload ${uploadType}`);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" style={{ color: "#4F46E5" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F4F6" }}>
      {/* Header */}
      <div className="bg-white border-bottom">
        <Container>
          <div className="py-4">
            <h2
              className="text-dark mb-2"
              style={{ fontWeight: "600", color: "#000000" }}
            >
              Instructor Dashboard
            </h2>
            <p className="mb-0 text-muted">
              Manage your courses and track earnings
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <FaDollarSign
                  size={40}
                  style={{ color: "#10B981" }}
                  className="mb-2"
                />
                <h3 className="mb-1">
                  ₹{stats.totalEarnings.toLocaleString()}
                </h3>
                <p className="text-muted mb-0 small">Total Earnings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <FaBook
                  size={40}
                  style={{ color: "#4F46E5" }}
                  className="mb-2"
                />
                <h3 className="mb-1">{stats.totalCourses}</h3>
                <p className="text-muted mb-0 small">Total Courses</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <FaUsers
                  size={40}
                  style={{ color: "#F59E0B" }}
                  className="mb-2"
                />
                <h3 className="mb-1">{stats.totalStudents}</h3>
                <p className="text-muted mb-0 small">Total Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <FaStar
                  size={40}
                  style={{ color: "#EF4444" }}
                  className="mb-2"
                />
                <h3 className="mb-1">{stats.avgRating}</h3>
                <p className="text-muted mb-0 small">Average Rating</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Card className="shadow-sm border-0">
          <Card.Body>
            <Tabs defaultActiveKey="courses" className="mb-3">
              {/* My Courses Tab */}
              <Tab eventKey="courses" title="My Courses">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Course Management</h5>
                  <Button
                    style={{ backgroundColor: "#4F46E5", border: "none" }}
                    onClick={() => setShowUploadModal(true)}
                  >
                    <FaPlus className="me-2" />
                    Upload Content
                  </Button>
                </div>

                <Table responsive hover>
                  <thead className="table-light">
                    <tr>
                      <th>Course Title</th>
                      <th>Students</th>
                      <th>Rating</th>
                      <th>Content</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <div>
                            <strong>{course.title}</strong>
                            <br />
                            <small className="text-muted">
                              {course.category}
                            </small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {course.totalStudents || 0}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" size={12} />
                            <small>{course.rating || "N/A"}</small>
                          </div>
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
                              <FaEye size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() =>
                                navigate(`/learning/${course._id}`)
                              }
                              title="Preview Content"
                            >
                              <FaPlay size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {courses.length === 0 && (
                  <Alert variant="info" className="text-center">
                    <FaBook size={40} className="mb-2 d-block mx-auto" />
                    <p className="mb-0">
                      No courses found. Start creating your first course!
                    </p>
                  </Alert>
                )}
              </Tab>

              {/* Earnings Tab */}
              <Tab eventKey="earnings" title="Earnings">
                <div className="mb-4">
                  <h5 className="mb-3">Earnings Overview</h5>
                  <Row>
                    <Col md={6}>
                      <Card className="bg-success text-white">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="text-white-50">This Month</h6>
                              <h4>
                                ₹{(stats.totalEarnings * 0.3).toLocaleString()}
                              </h4>
                            </div>
                            <FaChartLine size={30} />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="bg-info text-white">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="text-white-50">Total Earnings</h6>
                              <h4>₹{stats.totalEarnings.toLocaleString()}</h4>
                            </div>
                            <FaDollarSign size={30} />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                <h6 className="mb-3">Recent Earnings</h6>
                <Table responsive hover>
                  <thead className="table-light">
                    <tr>
                      <th>Course</th>
                      <th>Student</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>JavaScript Fundamentals</td>
                      <td>John Doe</td>
                      <td>₹599</td>
                      <td>Oct 3, 2025</td>
                      <td>
                        <span className="badge bg-success">Paid</span>
                      </td>
                    </tr>
                    <tr>
                      <td>React Development</td>
                      <td>Jane Smith</td>
                      <td>₹799</td>
                      <td>Oct 2, 2025</td>
                      <td>
                        <span className="badge bg-success">Paid</span>
                      </td>
                    </tr>
                    <tr>
                      <td>JavaScript Fundamentals</td>
                      <td>Mike Johnson</td>
                      <td>₹599</td>
                      <td>Oct 1, 2025</td>
                      <td>
                        <span className="badge bg-warning">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Upload Modal */}
        <Modal
          show={showUploadModal}
          onHide={() => setShowUploadModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Upload Content</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Content Type</Form.Label>
                    <Form.Select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value)}
                    >
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Course</Form.Label>
                    <Form.Select
                      value={uploadData.courseId}
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          courseId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, title: e.target.value })
                  }
                  placeholder={`Enter ${uploadType} title`}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      description: e.target.value,
                    })
                  }
                  placeholder={`Enter ${uploadType} description`}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  {uploadType === "video" ? "Video URL" : "Document URL"}
                </Form.Label>
                <Form.Control
                  type="url"
                  value={uploadData.fileUrl}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, fileUrl: e.target.value })
                  }
                  placeholder={`Enter ${uploadType} URL`}
                />
              </Form.Group>

              {uploadType === "video" && (
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={uploadData.duration}
                    onChange={(e) =>
                      setUploadData({ ...uploadData, duration: e.target.value })
                    }
                    placeholder="e.g., 15:30"
                  />
                </Form.Group>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleFileUpload}
              disabled={!uploadData.title || !uploadData.fileUrl}
            >
              <FaUpload className="me-2" />
              Upload {uploadType === "video" ? "Video" : "Document"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default InstructorDashboard;
