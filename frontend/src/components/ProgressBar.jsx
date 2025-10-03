import React from "react";

/**
 * Progress Bar Component
 * Displays course completion progress
 */
const ProgressBar = ({ percentage = 0, height = "12px", showLabel = true }) => {
  return (
    <div className="progress-container">
      {showLabel && (
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted small">Course Progress</span>
          <span className="fw-bold small" style={{ color: "#4F46E5" }}>
            {percentage}% Complete
          </span>
        </div>
      )}
      <div className="progress" style={{ height: height }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#4F46E5",
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
