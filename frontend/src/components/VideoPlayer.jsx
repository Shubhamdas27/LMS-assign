import React, { useState } from "react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

/**
 * Video Player Component
 * Custom video player with controls
 */
const VideoPlayer = ({ videoUrl, thumbnail, title, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Check if video URL is YouTube
  const isYouTube =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  if (isYouTube) {
    // Extract YouTube video ID
    let videoId = "";
    let embedUrl = videoUrl;

    if (videoUrl.includes("youtube.com/embed/")) {
      // Already an embed URL, use as is
      embedUrl = videoUrl;
    } else if (videoUrl.includes("youtube.com/watch?v=")) {
      videoId = videoUrl.split("v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
      <div
        className="video-player-container"
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          loading="lazy"
          onError={(e) => {
            console.log("Video loading error:", e);
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#f8f9fa",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#6b7280",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎥</div>
          <h5>Video Temporarily Unavailable</h5>
          <p>
            This video might be temporarily unavailable due to network issues.
          </p>
          <a
            href={embedUrl.replace("/embed/", "/watch?v=")}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Watch on YouTube →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        className="w-100"
        poster={thumbnail}
        onEnded={handleVideoEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
