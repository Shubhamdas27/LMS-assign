const mongoose = require("mongoose");

/**
 * Video Model
 * Represents video content within a section
 */
const videoSchema = new mongoose.Schema({
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Video title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: [true, "Video URL is required"],
  },
  thumbnail: {
    type: String,
    default: "https://via.placeholder.com/320x180",
  },
  duration: {
    type: String,
    default: "0:00",
  },
  order: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
videoSchema.index({ section: 1, order: 1 });

module.exports = mongoose.model("Video", videoSchema);
