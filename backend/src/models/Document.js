const mongoose = require("mongoose");

/**
 * Document Model
 * Represents documents/files within a section
 */
const documentSchema = new mongoose.Schema({
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Document title is required"],
    trim: true,
  },
  fileUrl: {
    type: String,
    required: [true, "File URL is required"],
  },
  fileType: {
    type: String,
    enum: ["pdf", "docx", "pptx", "txt", "other"],
    default: "pdf",
  },
  summary: {
    type: String,
    default: null,
  },
  order: {
    type: Number,
    required: true,
    min: 1,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
documentSchema.index({ section: 1, order: 1 });

module.exports = mongoose.model("Document", documentSchema);
