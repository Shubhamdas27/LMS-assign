const mongoose = require("mongoose");

/**
 * Progress Model
 * Tracks user progress through courses
 */
const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  completedDocuments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
