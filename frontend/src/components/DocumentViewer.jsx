import React, { useState } from "react";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { FaFileAlt, FaDownload, FaRobot } from "react-icons/fa";
import api from "../services/api";
import { toast } from "react-toastify";

/**
 * Document Viewer Component
 * Displays documents with AI summarization feature
 */
const DocumentViewer = ({ document, onComplete }) => {
  const [summary, setSummary] = useState(document.summary || null);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleSummarize = async () => {
    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    try {
      setLoading(true);

      // For demo purposes, using placeholder text
      const response = await api.post(`/documents/${document._id}/summarize`, {
        documentText:
          "This is a sample educational document about " +
          document.title +
          ". It covers important concepts and learning outcomes that students should understand.",
      });

      if (response.data.success) {
        setSummary(response.data.summary);
        setShowSummary(true);
        toast.success(
          response.data.cached
            ? "Summary loaded from cache"
            : "Summary generated successfully!"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate summary"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-viewer">
      <Card className="shadow-sm mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <FaFileAlt
                size={40}
                style={{ color: "#4F46E5" }}
                className="me-3"
              />
              <div>
                <h5 className="mb-1">{document.title}</h5>
                <small className="text-muted text-uppercase">
                  {document.fileType} Document
                </small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleSummarize}
                disabled={loading}
                size="sm"
                style={{ backgroundColor: "#4F46E5" }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaRobot className="me-1" />
                    {summary
                      ? (showSummary ? "Hide" : "Show") + " AI Summary"
                      : "Summarize with AI"}
                  </>
                )}
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                href={document.fileUrl}
                target="_blank"
              >
                <FaDownload className="me-1" /> Download
              </Button>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                document.fileUrl
              )}&embedded=true`}
              style={{ width: "100%", height: "500px", border: "none" }}
              title={document.title}
            />

            {/* AI Summary Overlay */}
            {showSummary && summary && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                  borderRadius: "8px",
                  padding: "20px",
                  overflowY: "auto",
                  zIndex: 1000,
                  border: "2px solid #4F46E5",
                  boxShadow: "0 8px 32px rgba(79, 70, 229, 0.15)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <FaRobot
                      className="me-2"
                      style={{ color: "#4F46E5", fontSize: "1.2rem" }}
                    />
                    <h5
                      className="mb-0"
                      style={{ color: "#4F46E5", fontWeight: "600" }}
                    >
                      AI Generated Summary
                    </h5>
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setShowSummary(false)}
                    style={{
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "12px",
                    }}
                  >
                    ✕ Close
                  </Button>
                </div>
                <div
                  style={{
                    whiteSpace: "pre-line",
                    lineHeight: "1.6",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  {summary}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 d-flex gap-2">
            {onComplete && (
              <Button variant="success" onClick={onComplete}>
                Mark as Complete
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DocumentViewer;
