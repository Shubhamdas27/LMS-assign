const mongoose = require("mongoose");

/**
 * Course Model
 * Represents courses in the LMS
 */
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Course description is required"],
  },
  thumbnail: {
    type: String,
    default: "https://via.placeholder.com/400x250",
  },
  price: {
    type: Number,
    default: 500,
    min: 0,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  totalStudents: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: "General",
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  duration: {
    type: String,
    default: "Self-paced",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ instructor: 1 });

module.exports = mongoose.model("Course", courseSchema);
