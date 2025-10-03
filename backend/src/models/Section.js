const mongoose = require("mongoose");

/**
 * Section Model
 * Represents sections/modules within a course
 */
const sectionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Section title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
    min: 1,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
sectionSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model("Section", sectionSchema);
