# 🤖 Gemini AI Document Summarization Guide

## Overview

The LMS platform now features a **comprehensive AI-powered document summarization system** that generates **minimum 500-word detailed summaries** for educational documents using Google's Gemini AI.

---

## 🚀 Quick Start

### 1. Setup Environment

Your `.env` file should already have the Gemini API key configured:

```bash
GEMINI_API_KEY=AIzaSyALTNnxY7Eal3KKSMqR_2Mq02mobqZoUHw
```

✅ **Your API key is already configured!**

### 2. Test the Integration

Run the test script to verify everything is working:

```bash
cd backend
node test-gemini.js
```

This will:

- ✅ Check environment configuration
- ✅ Initialize Gemini AI
- ✅ Test API connection
- ✅ Generate sample summaries
- ✅ Verify 500+ word requirement

---

## 📚 Features

### ✨ Key Capabilities

1. **Multiple Summarization Modes**

   - 📖 **Comprehensive** (default) - Detailed 500-800 word summaries
   - 🎯 **Concise** - Shorter, focused summaries
   - 🔬 **Technical** - Technical documentation focus
   - 🎓 **Academic** - Scholarly, research-oriented
   - 👨‍🎓 **Student-Friendly** - Easy-to-understand format

2. **Intelligent Structure** (7 Sections)

   - 📚 Executive Overview
   - 🎯 Foundational Concepts
   - 📖 Learning Objectives
   - 💡 Key Details & Information
   - 🚀 Practical Applications
   - 🔍 Critical Insights
   - 🎓 Conclusion & Next Steps

3. **Robust Fallback System**

   - Works even if Gemini API is unavailable
   - Intelligent content analysis
   - Always generates 500+ word summaries

4. **Quality Assurance**
   - Automatic word count validation
   - Summary enhancement if too short
   - Content quality checks

---

## 🛠️ API Usage

### Generate Summary Endpoint

**POST** `/api/documents/:id/summarize`

#### Request Examples

**Option 1: With Document Text (Recommended)**

```javascript
POST /api/documents/:id/summarize
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "documentText": "Your document content here...",
  "mode": "comprehensive",
  "minWords": 500,
  "maxWords": 800
}
```

**Option 2: Without Text (Uses Default Summary)**

```javascript
POST /api/documents/:id/summarize
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
// No body needed - generates comprehensive default summary
```

**Option 3: Force Refresh**

```javascript
POST /api/documents/:id/summarize?forceNew=true
Body: {
  "documentText": "Updated content..."
}
```

#### Response Format

```json
{
  "success": true,
  "message": "AI-generated comprehensive document summary created",
  "summary": "# Comprehensive Educational Summary...",
  "cached": false,
  "autoExtracted": false,
  "aiGenerated": true,
  "wordCount": 650
}
```

---

## 💻 Code Examples

### Backend - Using the Summarization Service

```javascript
const { generateSummary, SUMMARIZATION_MODES } = require("./utils/gemini");

// Example 1: Basic comprehensive summary
const summary = await generateSummary(documentText, "React Documentation");

// Example 2: With options
const summary = await generateSummary(documentText, "Advanced React Patterns", {
  mode: SUMMARIZATION_MODES.COMPREHENSIVE,
  minWords: 500,
  maxWords: 800,
  includeKeywords: true,
  includeQuestions: false,
});

// Example 3: Student-friendly mode
const studentSummary = await generateSummary(
  documentText,
  "Introduction to JavaScript",
  {
    mode: SUMMARIZATION_MODES.STUDENT_FRIENDLY,
    minWords: 500,
  }
);
```

### Frontend - Calling the API

```javascript
// Summarize document with text
async function summarizeDocument(documentId, text) {
  try {
    const response = await fetch(`/api/documents/${documentId}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        documentText: text,
        mode: "comprehensive",
        minWords: 500,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Summary generated:", data.summary);
      console.log("Word count:", data.wordCount);
      return data.summary;
    }
  } catch (error) {
    console.error("Summarization failed:", error);
  }
}

// Force regenerate summary
async function regenerateSummary(documentId, newText) {
  const response = await fetch(
    `/api/documents/${documentId}/summarize?forceNew=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ documentText: newText }),
    }
  );

  return await response.json();
}
```

---

## 🔧 Configuration Options

### Summarization Modes

```javascript
const SUMMARIZATION_MODES = {
  COMPREHENSIVE: "comprehensive", // 500-800 words, detailed
  CONCISE: "concise", // 300-500 words, focused
  TECHNICAL: "technical", // Technical documentation
  ACADEMIC: "academic", // Scholarly format
  STUDENT_FRIENDLY: "student_friendly", // Easy to understand
};
```

### Configuration Parameters

```javascript
const options = {
  mode: "comprehensive", // Summarization mode
  minWords: 500, // Minimum word count
  maxWords: 800, // Maximum word count
  includeKeywords: true, // Include keyword list
  includeQuestions: false, // Include review questions
};
```

---

## 🧪 Testing

### Run All Tests

```bash
# Navigate to backend
cd backend

# Run comprehensive test suite
node test-gemini.js
```

### Test Output Example

```
═══════════════════════════════════════════════════════════
🧪 GEMINI AI SUMMARIZATION TEST SUITE
═══════════════════════════════════════════════════════════

📋 Test 1: Environment Configuration
─────────────────────────────────────
✅ GEMINI_API_KEY found: AIzaSyALTNnxY7Eal3K...

📋 Test 2: Gemini Initialization
─────────────────────────────────────
✅ Successfully initialized with model: gemini-2.5-flash
Initialization result: ✅ Success

📋 Test 5: Basic Document Summarization (500+ words)
─────────────────────────────────────
Summary word count: 687 words
Meets 500-word minimum: ✅ Yes
```

---

## 📊 Performance & Limits

### API Limits (Gemini Free Tier)

- **Rate Limit**: 60 requests per minute
- **Daily Quota**: Check your Google AI Studio dashboard
- **Input Token Limit**: ~30,000 tokens (~10,000 words)

### Optimization Features

- ✅ Automatic text truncation at 10,000 characters
- ✅ Intelligent sentence boundary preservation
- ✅ Response caching (summaries saved in database)
- ✅ 3 automatic retries on failure
- ✅ Fallback to local summarization if API fails

---

## 🐛 Troubleshooting

### Issue: "AI summarization is currently unavailable"

**Solution 1: Check API Key**

```bash
# Verify API key is in .env file
cat .env | grep GEMINI_API_KEY

# Should show:
# GEMINI_API_KEY=AIzaSy...
```

**Solution 2: Test Connection**

```bash
cd backend
node test-gemini.js
```

**Solution 3: Check API Key Status**

1. Visit: https://makersuite.google.com/app/apikey
2. Verify your API key is active
3. Check quota usage

### Issue: Summary is too short

The system automatically enhances short summaries. If you still get short summaries:

```javascript
// Explicitly set minimum words
const summary = await generateSummary(text, title, {
  minWords: 600, // Increase minimum
  maxWords: 1000, // Increase maximum
});
```

### Issue: API Rate Limit Exceeded

```javascript
// Summaries are cached automatically
// If you get rate limit errors, use cached version:

// Check if summary exists before regenerating
if (document.summary && !forceNew) {
  return document.summary;
}
```

---

## 🎯 Best Practices

### 1. Provide Quality Input

```javascript
// ✅ Good: Clean, structured text
const text = `
React is a JavaScript library for building user interfaces.
It uses a component-based architecture...
`;

// ❌ Avoid: Very short or unstructured text
const text = "React";
```

### 2. Use Appropriate Modes

```javascript
// For technical docs
mode: SUMMARIZATION_MODES.TECHNICAL;

// For student materials
mode: SUMMARIZATION_MODES.STUDENT_FRIENDLY;

// For research papers
mode: SUMMARIZATION_MODES.ACADEMIC;
```

### 3. Cache Summaries

```javascript
// Check cache first
if (document.summary && !needsUpdate) {
  return document.summary;
}

// Only regenerate when needed
const summary = await generateSummary(text, title);
document.summary = summary;
await document.save();
```

### 4. Handle Errors Gracefully

```javascript
try {
  const summary = await generateSummary(text, title);
  // Use AI summary
} catch (error) {
  // System automatically provides fallback
  // No need for additional error handling
}
```

---

## 📝 Sample Summary Output

### Input (React Documentation - 150 words)

```
React is a JavaScript library for building user interfaces...
[150 words of React documentation]
```

### Output (Comprehensive Mode - 650 words)

```markdown
# Comprehensive Educational Summary: React Documentation

## 📚 Document Overview and Educational Context

This educational resource, titled "React Documentation", provides comprehensive
coverage of React, a powerful JavaScript library developed by Facebook for
building modern user interfaces...

## 🎯 Core Concepts and Key Learning Points

The document systematically introduces React's fundamental architecture,
beginning with the revolutionary concept of component-based development...

[... continues for 650+ words with 7 detailed sections ...]
```

---

## 🔗 Additional Resources

- **Google AI Studio**: https://makersuite.google.com/app/apikey
- **Gemini API Docs**: https://ai.google.dev/docs
- **LMS Documentation**: See DEPLOYMENT_GUIDE.md

---

## ✅ Checklist for Production

- [x] GEMINI_API_KEY configured in .env
- [ ] Run test suite successfully
- [ ] Test summarization in development
- [ ] Configure production API key
- [ ] Set up monitoring for API usage
- [ ] Test fallback mechanism
- [ ] Review rate limiting settings

---

## 🎉 You're All Set!

Your Gemini AI summarization system is configured and ready to use. Run the test to verify:

```bash
cd backend
node test-gemini.js
```

For questions or issues, check the troubleshooting section above or review the comprehensive code comments in `backend/src/utils/gemini.js`.

**Happy Summarizing! 🚀**
