const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/**
 * Document Routes
 */

// @route   GET /api/documents/:id
// @desc    Get single document
// @access  Private
router.get("/:id", auth, documentController.getDocumentById);

// @route   POST /api/documents/upload
// @desc    Upload document to section
// @access  Private/Admin
router.post(
  "/upload",
  auth,
  admin,
  documentController.uploadDocumentValidation,
  documentController.uploadDocument
);

// @route   POST /api/documents/:id/summarize
// @desc    Summarize document with AI
// @access  Private
router.post("/:id/summarize", auth, documentController.summarizeDocument);

// @route   PUT /api/documents/:id
// @desc    Update document
// @access  Private/Admin
router.put("/:id", auth, admin, documentController.updateDocument);

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private/Admin
router.delete("/:id", auth, admin, documentController.deleteDocument);

module.exports = router;
