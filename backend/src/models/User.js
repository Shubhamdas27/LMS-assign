const mongoose = require("mongoose");

/**
 * User Model
 * Represents users in the system (students and admins)
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  avatar: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
