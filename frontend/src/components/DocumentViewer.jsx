import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { FaFileAlt, FaDownload, FaRobot, FaSync, FaBook } from "react-icons/fa";
import api from "../services/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

/**
 * Document Viewer Component
 * Displays documents with AI summarization feature
 */
const DocumentViewer = ({ document, onComplete }) => {
  const [summary, setSummary] = useState(document.summary || null);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryInfo, setSummaryInfo] = useState(null);

  // Auto-load summary if it exists
  useEffect(() => {
    if (document.summary) {
      setSummary(document.summary);
    }
  }, [document]);

  const handleSummarize = async (forceNew = false) => {
    // If summary exists and we're not forcing new, just toggle display
    if (summary && !forceNew) {
      setShowSummary(!showSummary);
      return;
    }

    try {
      setLoading(true);

      // Call API to generate summary
      const response = await api.post(`/documents/${document._id}/summarize`, {
        // You can optionally provide documentText here if you have it
        // For now, it will use the default comprehensive summary
        forceNew: forceNew,
      });

      if (response.data.success) {
        setSummary(response.data.summary);
        setShowSummary(true);
        setSummaryInfo({
          cached: response.data.cached,
          aiGenerated: response.data.aiGenerated,
          wordCount: response.data.summary.split(/\s+/).length,
        });

        toast.success(
          response.data.cached
            ? "📚 Summary loaded from cache"
            : response.data.aiGenerated
            ? "🤖 AI Summary generated successfully!"
            : "✅ Comprehensive summary created"
        );
      }
    } catch (error) {
      console.error("Summary generation error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to generate summary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateSummary = async () => {
    await handleSummarize(true);
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
                <div>
                  <Badge bg="secondary" className="me-2">
                    {document.fileType?.toUpperCase() || "PDF"}
                  </Badge>
                  {summary && (
                    <Badge bg="success">
                      <FaBook className="me-1" size={10} />
                      Summary Available
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant={summary ? "success" : "primary"}
                onClick={() => handleSummarize(false)}
                disabled={loading}
                size="sm"
                style={{
                  backgroundColor: summary ? "#10B981" : "#4F46E5",
                  borderColor: summary ? "#10B981" : "#4F46E5",
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" />
                    Generating AI Summary...
                  </>
                ) : (
                  <>
                    <FaRobot className="me-1" />
                    {summary
                      ? showSummary
                        ? "Hide Summary"
                        : "Show Summary"
                      : "Generate AI Summary"}
                  </>
                )}
              </Button>

              {summary && !loading && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleRegenerateSummary}
                  title="Regenerate summary"
                >
                  <FaSync className="me-1" /> Regenerate
                </Button>
              )}

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

          {/* Summary Info Badge */}
          {summaryInfo && showSummary && (
            <Alert variant="info" className="mb-3 py-2">
              <small>
                <strong>📊 Summary Info:</strong> {summaryInfo.wordCount} words
                •{" "}
                {summaryInfo.aiGenerated
                  ? "🤖 AI Generated"
                  : "📝 Comprehensive"}{" "}
                • {summaryInfo.cached ? "💾 Cached" : "✨ Fresh"}
              </small>
            </Alert>
          )}

          <div style={{ position: "relative" }}>
            {/* Document iframe */}
            {!showSummary && (
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                  document.fileUrl
                )}&embedded=true`}
                style={{
                  width: "100%",
                  height: "600px",
                  border: "none",
                  borderRadius: "8px",
                }}
                title={document.title}
              />
            )}

            {/* AI Summary Display */}
            {showSummary && summary && (
              <Card
                style={{
                  border: "2px solid #4F46E5",
                  borderRadius: "12px",
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Card.Header
                  style={{
                    backgroundColor: "#4F46E5",
                    color: "white",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <FaRobot
                        className="me-2"
                        style={{ fontSize: "1.3rem" }}
                      />
                      <h5 className="mb-0">
                        AI-Generated Comprehensive Summary
                      </h5>
                    </div>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => setShowSummary(false)}
                      style={{
                        borderRadius: "20px",
                        padding: "4px 16px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      ✕ Close Summary
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body
                  style={{
                    maxHeight: "600px",
                    overflowY: "auto",
                    padding: "30px",
                  }}
                >
                  <div
                    className="summary-content"
                    style={{
                      lineHeight: "1.8",
                      fontSize: "15px",
                      color: "#1F2937",
                    }}
                  >
                    {/* Render markdown if using ReactMarkdown, otherwise use pre-formatted text */}
                    <div style={{ whiteSpace: "pre-wrap" }}>{summary}</div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>

          <div className="mt-3 d-flex gap-2 justify-content-between align-items-center">
            <div>
              {!summary && !loading && (
                <Alert variant="warning" className="mb-0 py-2">
                  <small>
                    <FaRobot className="me-2" />
                    <strong>Tip:</strong> Click "Generate AI Summary" to get a
                    comprehensive 500+ word summary of this document!
                  </small>
                </Alert>
              )}
            </div>
            <div>
              {onComplete && (
                <Button variant="success" onClick={onComplete}>
                  ✓ Mark as Complete
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Custom CSS for better summary display */}
      <style>{`
        .summary-content h1,
        .summary-content h2 {
          color: #4F46E5;
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .summary-content h1 {
          font-size: 1.8rem;
          border-bottom: 3px solid #4F46E5;
          padding-bottom: 8px;
        }
        
        .summary-content h2 {
          font-size: 1.4rem;
          border-bottom: 2px solid #E5E7EB;
          padding-bottom: 6px;
        }
        
        .summary-content h3 {
          color: #6366F1;
          font-size: 1.2rem;
          margin-top: 16px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .summary-content p {
          margin-bottom: 14px;
        }
        
        .summary-content strong {
          color: #4F46E5;
          font-weight: 600;
        }
        
        .summary-content ul,
        .summary-content ol {
          margin-left: 20px;
          margin-bottom: 14px;
        }
        
        .summary-content li {
          margin-bottom: 6px;
        }
        
        .summary-content::-webkit-scrollbar {
          width: 8px;
        }
        
        .summary-content::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 4px;
        }
        
        .summary-content::-webkit-scrollbar-thumb {
          background: #4F46E5;
          border-radius: 4px;
        }
        
        .summary-content::-webkit-scrollbar-thumb:hover {
          background: #4338CA;
        }
      `}</style>
    </div>
  );
};

export default DocumentViewer;
