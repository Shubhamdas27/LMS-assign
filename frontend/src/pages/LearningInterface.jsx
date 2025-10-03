import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { FaPlay, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../services/api";
import VideoPlayer from "../components/VideoPlayer";
import DocumentViewer from "../components/DocumentViewer";
import ProgressBar from "../components/ProgressBar";

/**
 * Learning Interface
 * Main learning page with sidebar and content viewer
 */
const LearningInterface = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState(null); // 'video' or 'document'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAndProgress();
  }, [id]);

  const fetchCourseAndProgress = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/progress/course/${id}`),
      ]);

      setCourse(courseRes.data.course);
      setProgress(progressRes.data.progress);

      // Auto-select first video
      if (courseRes.data.course.sections?.[0]?.videos?.[0]) {
        setSelectedContent(courseRes.data.course.sections[0].videos[0]);
        setContentType("video");
      }
    } catch (error) {
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const isVideoCompleted = (videoId) => {
    return progress?.completedVideos?.some(
      (v) => v._id === videoId || v === videoId
    );
  };

  const isDocumentCompleted = (docId) => {
    return progress?.completedDocuments?.some(
      (d) => d._id === docId || d === docId
    );
  };

  const handleMarkVideoComplete = async () => {
    try {
      const response = await api.post(`/progress/video/${selectedContent._id}`);
      setProgress({
        ...progress,
        completedVideos: [
          ...(progress.completedVideos || []),
          selectedContent._id,
        ],
        progressPercentage: response.data.progress,
      });
      toast.success("Video marked as complete!");
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const handleMarkDocumentComplete = async () => {
    try {
      const response = await api.post(
        `/progress/document/${selectedContent._id}`
      );
      setProgress({
        ...progress,
        completedDocuments: [
          ...(progress.completedDocuments || []),
          selectedContent._id,
        ],
        progressPercentage: response.data.progress,
      });
      toast.success("Document marked as complete!");
    } catch (error) {
      toast.error("Failed to update progress");
    }
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
    <div style={{ marginTop: "56px", minHeight: "100vh" }}>
      <Container fluid>
        <Row className="g-0">
          {/* Sidebar */}
          <Col
            lg={3}
            className="bg-light border-end"
            style={{ height: "calc(100vh - 56px)", overflowY: "auto" }}
          >
            <div className="p-3">
              <h5 className="mb-3">{course?.title}</h5>
              <ProgressBar percentage={progress?.progressPercentage || 0} />
            </div>

            <ListGroup variant="flush">
              {course?.sections?.map((section, sIndex) => (
                <div key={section._id}>
                  <ListGroup.Item className="bg-secondary text-white fw-bold">
                    Section {sIndex + 1}: {section.title}
                  </ListGroup.Item>

                  {section.videos?.map((video) => (
                    <ListGroup.Item
                      key={video._id}
                      action
                      active={
                        selectedContent?._id === video._id &&
                        contentType === "video"
                      }
                      onClick={() => {
                        setSelectedContent(video);
                        setContentType("video");
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <FaPlay className="me-2" size={12} />
                        <small>{video.title}</small>
                      </div>
                      {isVideoCompleted(video._id) && (
                        <FaCheckCircle style={{ color: "#10B981" }} />
                      )}
                    </ListGroup.Item>
                  ))}

                  {section.documents?.map((doc) => (
                    <ListGroup.Item
                      key={doc._id}
                      action
                      active={
                        selectedContent?._id === doc._id &&
                        contentType === "document"
                      }
                      onClick={() => {
                        setSelectedContent(doc);
                        setContentType("document");
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <FaFileAlt className="me-2" size={12} />
                        <small>{doc.title}</small>
                      </div>
                      {isDocumentCompleted(doc._id) && (
                        <FaCheckCircle style={{ color: "#10B981" }} />
                      )}
                    </ListGroup.Item>
                  ))}
                </div>
              ))}
            </ListGroup>
          </Col>

          {/* Main Content Area */}
          <Col
            lg={9}
            style={{ height: "calc(100vh - 56px)", overflowY: "auto" }}
          >
            <div className="p-4">
              {selectedContent ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>{selectedContent.title}</h4>
                    {contentType === "video" &&
                      !isVideoCompleted(selectedContent._id) && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={handleMarkVideoComplete}
                        >
                          <FaCheckCircle className="me-2" />
                          Mark as Complete
                        </Button>
                      )}
                  </div>

                  {selectedContent.description && (
                    <p className="text-muted mb-4">
                      {selectedContent.description}
                    </p>
                  )}

                  {contentType === "video" ? (
                    <VideoPlayer
                      videoUrl={selectedContent.videoUrl}
                      thumbnail={selectedContent.thumbnail}
                      title={selectedContent.title}
                      onComplete={handleMarkVideoComplete}
                    />
                  ) : (
                    <DocumentViewer
                      document={selectedContent}
                      onComplete={
                        !isDocumentCompleted(selectedContent._id)
                          ? handleMarkDocumentComplete
                          : null
                      }
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">
                    Select a video or document to start learning
                  </h5>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LearningInterface;
