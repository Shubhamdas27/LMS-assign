/**
 * Application Constants - Central Configuration
 * All hardcoded values should be defined here
 */

// Company Information
export const COMPANY_INFO = {
  name: "Premium LMS",
  tagline: "Where Hearts Meet Hope",
  description:
    "Transform your career with expert-led courses, AI-powered learning assistance, and industry-recognized certifications.",
  email: "support@premiumlms.com",
  phone: "+1 (234) 567-890",
  address: "123 Learning Street, Education City, NY 10001",
  socialMedia: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  workingHours: {
    weekdays: "Mon - Fri: 9AM - 6PM",
    weekends: "Sat - Sun: 10AM - 4PM",
  },
};

// Platform Statistics
export const PLATFORM_STATS = {
  students: {
    count: "10K+",
    label: "Active Students",
    description: "Join thousands of successful learners worldwide",
  },
  courses: {
    count: "500+",
    label: "Premium Courses",
    description: "Expert-curated learning paths across multiple domains",
  },
  instructors: {
    count: "50+",
    label: "Expert Instructors",
    description: "Learn from industry professionals and certified educators",
  },
  completionRate: {
    percentage: 75,
    label: "Completion Rate",
  },
  satisfaction: {
    percentage: 98,
    label: "Student Satisfaction",
  },
};

// Features
export const FEATURES = {
  aiPowered: {
    title: "AI-Powered",
    subtitle: "Smart Summaries",
    description:
      "AI-driven personalized learning paths and intelligent content recommendations",
  },
  access247: {
    title: "24/7 Access",
    subtitle: "Learn Anytime",
    description:
      "Study at your own pace with unlimited access to all course materials",
  },
  expertInstructors: {
    title: "Expert Instructors",
    subtitle: "Industry Leaders",
    description:
      "Learn from professionals with real-world experience and proven expertise",
  },
  certified: {
    title: "Certified",
    subtitle: "Industry-Recognized",
    description:
      "Earn certificates that boost your career and validate your skills",
  },
};

// Trust Badges
export const TRUST_BADGES = [
  {
    icon: "FaCheckCircle",
    text: "100% Money Back",
    color: "#10b981",
  },
  {
    icon: "FaCheckCircle",
    text: "Lifetime Access",
    color: "#10b981",
  },
  {
    icon: "FaCheckCircle",
    text: "Certificate",
    color: "#10b981",
  },
];

// Mission & Vision
export const MISSION_VISION = {
  mission: {
    title: "Our Mission",
    description:
      "To democratize education and make world-class learning accessible to everyone, everywhere, by leveraging cutting-edge technology and expert instruction.",
    points: [
      {
        title: "Innovation First",
        description:
          "We continuously push boundaries with AI-powered learning tools and cutting-edge educational technology.",
        icon: "FaRocket",
      },
      {
        title: "Student Success",
        description:
          "Your growth is our priority. We provide personalized support and resources for every learner.",
        icon: "FaUsers",
      },
      {
        title: "Quality Content",
        description:
          "Every course is carefully crafted and reviewed by industry experts to ensure maximum value.",
        icon: "FaBrain",
      },
      {
        title: "Global Impact",
        description:
          "Breaking down barriers to education and creating opportunities for learners worldwide.",
        icon: "FaGlobe",
      },
    ],
  },
  vision: {
    title: "Our Vision",
    description:
      "To become the world's most trusted and innovative learning platform, where every individual can unlock their full potential and achieve their career aspirations.",
  },
};

// Values
export const CORE_VALUES = [
  {
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, from course content to student support.",
    icon: "FaStar",
    color: "#fbbf24",
  },
  {
    title: "Innovation",
    description:
      "We embrace new technologies and methodologies to enhance the learning experience.",
    icon: "FaLightbulb",
    color: "#2563eb",
  },
  {
    title: "Accessibility",
    description:
      "Education should be available to everyone, regardless of location or background.",
    icon: "FaGlobe",
    color: "#8b5cf6",
  },
  {
    title: "Community",
    description:
      "We build a supportive community where learners and instructors grow together.",
    icon: "FaHeart",
    color: "#ec4899",
  },
];

// FAQ
export const FAQ_ITEMS = [
  {
    question: "How do I enroll in a course?",
    answer:
      "Simply browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll need to create an account if you haven't already.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and popular digital payment methods through our secure Razorpay integration.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact us within 30 days for a full refund.",
  },
  {
    question: "Do you provide certificates?",
    answer:
      "Absolutely! Upon successful completion of a course, you'll receive a verified digital certificate that you can share on LinkedIn and your resume.",
  },
];

// Course Categories
export const COURSE_CATEGORIES = [
  { name: "Web Development", slug: "web-development" },
  { name: "Data Science", slug: "data-science" },
  { name: "AI & ML", slug: "ai-ml" },
  { name: "Mobile Development", slug: "mobile-dev" },
  { name: "Business", slug: "business" },
  { name: "Design", slug: "design" },
  { name: "Marketing", slug: "marketing" },
  { name: "Personal Development", slug: "personal-development" },
];

// Navigation Links
export const NAV_LINKS = {
  public: [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/courses", label: "Courses" },
    { path: "/contact", label: "Contact" },
  ],
  authenticated: [{ path: "/dashboard", label: "Dashboard" }],
  admin: [{ path: "/admin", label: "Admin Panel" }],
  instructor: [{ path: "/instructor", label: "Instructor Dashboard" }],
};

// Theme Colors
export const THEME_COLORS = {
  primary: "#2563eb",
  secondary: "#8b5cf6",
  accent: "#ec4899",
  success: "#10b981",
  warning: "#fbbf24",
  danger: "#ef4444",
  info: "#06b6d4",
};

// API Endpoints (if you want to centralize these)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Default Values
export const DEFAULTS = {
  coursesPerPage: 12,
  maxSearchResults: 50,
  sessionTimeout: 3600000, // 1 hour in milliseconds
  defaultAvatar: "/images/default-avatar.png",
  defaultCourseThumbnail: "/images/default-course.png",
};

export default {
  COMPANY_INFO,
  PLATFORM_STATS,
  FEATURES,
  TRUST_BADGES,
  MISSION_VISION,
  CORE_VALUES,
  FAQ_ITEMS,
  COURSE_CATEGORIES,
  NAV_LINKS,
  THEME_COLORS,
  API_BASE_URL,
  DEFAULTS,
};
