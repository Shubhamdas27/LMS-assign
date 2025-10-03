const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

// Load models
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Section = require("./src/models/Section");
const Video = require("./src/models/Video");
const Document = require("./src/models/Document");

// Load environment variables
dotenv.config();

/**
 * Seed Database with Sample Data
 * Run with: node seed-complete.js
 */
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Section.deleteMany({});
    await Video.deleteMany({});
    await Document.deleteMany({});

    console.log("👤 Creating demo users...");

    // Create Admin User with new credentials
    const adminPassword = await bcrypt.hash("Demo@2025", 10);
    const admin = await User.create({
      name: "Demo Admin",
      email: "demo.admin@premiumlms.com",
      password: adminPassword,
      role: "admin",
      avatar:
        "https://ui-avatars.com/api/?name=Demo+Admin&background=4F46E5&color=fff",
    });

    // Create Student User with new credentials
    const studentPassword = await bcrypt.hash("Demo@2025", 10);
    const student = await User.create({
      name: "Demo Student",
      email: "demo.student@premiumlms.com",
      password: studentPassword,
      role: "student",
      avatar:
        "https://ui-avatars.com/api/?name=Demo+Student&background=10B981&color=fff",
    });

    // Create additional demo users for variety
    const instructorPassword = await bcrypt.hash("Demo@2025", 10);
    const instructor = await User.create({
      name: "Demo Instructor",
      email: "demo.instructor@premiumlms.com",
      password: instructorPassword,
      role: "student", // Can be promoted to instructor later
      avatar:
        "https://ui-avatars.com/api/?name=Demo+Instructor&background=F59E0B&color=fff",
    });

    console.log("📚 Creating courses with PDFs for AI testing...");

    // ============= COURSE 1: Machine Learning =============
    const mlCourse = await Course.create({
      title: "Introduction to Machine Learning",
      description:
        "Learn the fundamentals of machine learning, including supervised and unsupervised learning, neural networks, and practical applications.",
      thumbnail:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
      price: 599,
      instructor: admin._id,
      category: "Data Science",
      level: "Beginner",
      duration: "8 weeks",
      rating: 4.8,
      totalStudents: 1250,
    });

    const mlSection1 = await Section.create({
      course: mlCourse._id,
      title: "Getting Started with ML",
      description: "Introduction to machine learning concepts",
      order: 1,
    });

    await Video.create({
      section: mlSection1._id,
      title: "What is Machine Learning?",
      description: "Introduction to ML concepts and applications",
      videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
      duration: "15:30",
      order: 1,
    });

    const mlDoc1 = await Document.create({
      section: mlSection1._id,
      title: "Machine Learning Fundamentals.pdf",
      fileUrl: "https://arxiv.org/pdf/1801.00631.pdf",
      fileType: "pdf",
      order: 1,
    });

    const mlDoc2 = await Document.create({
      section: mlSection1._id,
      title: "Neural Networks Guide.pdf",
      fileUrl: "https://arxiv.org/pdf/1404.7828.pdf",
      fileType: "pdf",
      order: 2,
    });

    mlSection1.documents.push(mlDoc1._id, mlDoc2._id);
    await mlSection1.save();
    mlCourse.sections.push(mlSection1._id);
    await mlCourse.save();

    // ============= COURSE 2: Full Stack Web Development =============
    const webCourse = await Course.create({
      title: "Full Stack Web Development",
      description:
        "Master full stack web development with React, Node.js, Express, and MongoDB. Build real-world applications.",
      thumbnail:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      price: 799,
      instructor: admin._id,
      category: "Programming",
      level: "Intermediate",
      duration: "12 weeks",
      rating: 4.9,
      totalStudents: 2100,
    });

    const webSection1 = await Section.create({
      course: webCourse._id,
      title: "Frontend Development",
      description: "Learn React.js and modern frontend",
      order: 1,
    });

    await Video.create({
      section: webSection1._id,
      title: "React Fundamentals",
      description: "Learn the basics of React.js",
      videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
      duration: "20:15",
      order: 1,
    });

    const webDoc1 = await Document.create({
      section: webSection1._id,
      title: "React Documentation.pdf",
      fileUrl: "https://arxiv.org/pdf/2103.09688.pdf",
      fileType: "pdf",
      order: 1,
    });

    const webDoc2 = await Document.create({
      section: webSection1._id,
      title: "JavaScript ES6 Features.pdf",
      fileUrl: "https://arxiv.org/pdf/1904.12210.pdf",
      fileType: "pdf",
      order: 2,
    });

    webSection1.documents.push(webDoc1._id, webDoc2._id);
    await webSection1.save();
    webCourse.sections.push(webSection1._id);
    await webCourse.save();

    // ============= COURSE 3: Python Programming =============
    const pythonCourse = await Course.create({
      title: "Python Programming for Beginners",
      description:
        "Start your programming journey with Python. Learn syntax, data structures, OOP, and build practical projects.",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
      price: 499,
      instructor: admin._id,
      category: "Programming",
      level: "Beginner",
      duration: "6 weeks",
      rating: 4.7,
      totalStudents: 3200,
    });

    const pySection1 = await Section.create({
      course: pythonCourse._id,
      title: "Python Basics",
      description: "Learn Python syntax and fundamentals",
      order: 1,
    });

    await Video.create({
      section: pySection1._id,
      title: "Introduction to Python",
      description: "Your first Python program",
      videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
      duration: "18:45",
      order: 1,
    });

    const pyDoc1 = await Document.create({
      section: pySection1._id,
      title: "Python Programming Guide.pdf",
      fileUrl: "https://arxiv.org/pdf/1506.03134.pdf",
      fileType: "pdf",
      order: 1,
    });

    const pyDoc2 = await Document.create({
      section: pySection1._id,
      title: "Python Data Science.pdf",
      fileUrl: "https://arxiv.org/pdf/1802.01548.pdf",
      fileType: "pdf",
      order: 2,
    });

    pySection1.documents.push(pyDoc1._id, pyDoc2._id);
    await pySection1.save();
    pythonCourse.sections.push(pySection1._id);
    await pythonCourse.save();

    // ============= COURSE 4: Digital Marketing =============
    const dmCourse = await Course.create({
      title: "Digital Marketing Mastery",
      description:
        "Master digital marketing strategies including SEO, social media marketing, content marketing, and paid advertising.",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      price: 549,
      instructor: admin._id,
      category: "Marketing",
      level: "Intermediate",
      duration: "10 weeks",
      rating: 4.6,
      totalStudents: 1850,
    });

    const dmSection1 = await Section.create({
      course: dmCourse._id,
      title: "SEO Fundamentals",
      description: "Learn search engine optimization",
      order: 1,
    });

    await Video.create({
      section: dmSection1._id,
      title: "SEO Strategy 2024",
      description: "Latest SEO techniques",
      videoUrl: "https://www.youtube.com/watch?v=DvwS7cV9GmQ",
      duration: "25:30",
      order: 1,
    });

    const dmDoc1 = await Document.create({
      section: dmSection1._id,
      title: "SEO Complete Guide.pdf",
      fileUrl: "https://arxiv.org/pdf/2001.00001.pdf",
      fileType: "pdf",
      order: 1,
    });

    const dmDoc2 = await Document.create({
      section: dmSection1._id,
      title: "Content Marketing Strategies.pdf",
      fileUrl: "https://arxiv.org/pdf/1907.02109.pdf",
      fileType: "pdf",
      order: 2,
    });

    const dmDoc3 = await Document.create({
      section: dmSection1._id,
      title: "Social Media Marketing.pdf",
      fileUrl: "https://arxiv.org/pdf/1810.02563.pdf",
      fileType: "pdf",
      order: 3,
    });

    dmSection1.documents.push(dmDoc1._id, dmDoc2._id, dmDoc3._id);
    await dmSection1.save();
    dmCourse.sections.push(dmSection1._id);
    await dmCourse.save();

    // ============= COURSE 5: UI/UX Design =============
    const uxCourse = await Course.create({
      title: "UI/UX Design Fundamentals",
      description:
        "Learn user interface and user experience design principles. Create beautiful, user-friendly designs using Figma.",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      price: 649,
      instructor: admin._id,
      category: "Design",
      level: "Beginner",
      duration: "8 weeks",
      rating: 4.8,
      totalStudents: 1650,
    });

    const uxSection1 = await Section.create({
      course: uxCourse._id,
      title: "Design Principles",
      description: "Understanding core design principles",
      order: 1,
    });

    await Video.create({
      section: uxSection1._id,
      title: "Introduction to UI/UX",
      description: "Basics of user interface design",
      videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
      duration: "22:10",
      order: 1,
    });

    const uxDoc1 = await Document.create({
      section: uxSection1._id,
      title: "Design Thinking Guide.pdf",
      fileUrl: "https://arxiv.org/pdf/1606.07402.pdf",
      fileType: "pdf",
      order: 1,
    });

    const uxDoc2 = await Document.create({
      section: uxSection1._id,
      title: "User Experience Principles.pdf",
      fileUrl: "https://arxiv.org/pdf/1701.01427.pdf",
      fileType: "pdf",
      order: 2,
    });

    uxSection1.documents.push(uxDoc1._id, uxDoc2._id);
    await uxSection1.save();
    uxCourse.sections.push(uxSection1._id);
    await uxCourse.save();

    // ============= COURSE 6: Data Science with R =============
    const dsCourse = await Course.create({
      title: "Data Science with R Programming",
      description:
        "Master data science using R. Learn statistical analysis, data visualization, and machine learning with R.",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      price: 699,
      instructor: admin._id,
      category: "Data Science",
      level: "Intermediate",
      duration: "10 weeks",
      rating: 4.7,
      totalStudents: 980,
    });

    const dsSection1 = await Section.create({
      course: dsCourse._id,
      title: "R Programming Basics",
      description: "Introduction to R programming",
      order: 1,
    });

    await Video.create({
      section: dsSection1._id,
      title: "Getting Started with R",
      description: "R programming fundamentals",
      videoUrl: "https://www.youtube.com/watch?v=_V8eKsto3Ug",
      duration: "19:45",
      order: 1,
    });

    const dsDoc1 = await Document.create({
      section: dsSection1._id,
      title: "R Programming Tutorial.pdf",
      fileUrl: "https://arxiv.org/pdf/1903.08471.pdf",
      fileType: "pdf",
      order: 1,
    });

    const dsDoc2 = await Document.create({
      section: dsSection1._id,
      title: "Statistical Analysis with R.pdf",
      fileUrl: "https://arxiv.org/pdf/1807.03973.pdf",
      fileType: "pdf",
      order: 2,
    });

    const dsDoc3 = await Document.create({
      section: dsSection1._id,
      title: "Data Visualization in R.pdf",
      fileUrl: "https://arxiv.org/pdf/1809.03062.pdf",
      fileType: "pdf",
      order: 3,
    });

    dsSection1.documents.push(dsDoc1._id, dsDoc2._id, dsDoc3._id);
    await dsSection1.save();
    dsCourse.sections.push(dsSection1._id);
    await dsCourse.save();

    // ============= COURSE 7: Cybersecurity Essentials =============
    const cyberCourse = await Course.create({
      title: "Cybersecurity Essentials",
      description:
        "Learn cybersecurity fundamentals, ethical hacking, network security, and how to protect systems from threats.",
      thumbnail:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
      price: 749,
      instructor: admin._id,
      category: "IT & Security",
      level: "Intermediate",
      duration: "12 weeks",
      rating: 4.9,
      totalStudents: 1420,
    });

    const cyberSection1 = await Section.create({
      course: cyberCourse._id,
      title: "Security Fundamentals",
      description: "Introduction to cybersecurity",
      order: 1,
    });

    await Video.create({
      section: cyberSection1._id,
      title: "Introduction to Cybersecurity",
      description: "Understanding security threats",
      videoUrl: "https://www.youtube.com/watch?v=inWWhr5tnEA",
      duration: "28:20",
      order: 1,
    });

    const cyberDoc1 = await Document.create({
      section: cyberSection1._id,
      title: "Cybersecurity Fundamentals.pdf",
      fileUrl: "https://arxiv.org/pdf/1901.05178.pdf",
      fileType: "pdf",
      order: 1,
    });

    const cyberDoc2 = await Document.create({
      section: cyberSection1._id,
      title: "Network Security Guide.pdf",
      fileUrl: "https://arxiv.org/pdf/1812.00675.pdf",
      fileType: "pdf",
      order: 2,
    });

    cyberSection1.documents.push(cyberDoc1._id, cyberDoc2._id);
    await cyberSection1.save();
    cyberCourse.sections.push(cyberSection1._id);
    await cyberCourse.save();

    // ============= COURSE 8: Blockchain Development =============
    const blockchainCourse = await Course.create({
      title: "Blockchain & Smart Contract Development",
      description:
        "Master blockchain technology and smart contract development with Ethereum and Solidity. Build decentralized applications.",
      thumbnail:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
      price: 899,
      instructor: admin._id,
      category: "Programming",
      level: "Advanced",
      duration: "14 weeks",
      rating: 4.8,
      totalStudents: 756,
    });

    const blockchainSection1 = await Section.create({
      course: blockchainCourse._id,
      title: "Blockchain Basics",
      description: "Understanding blockchain technology",
      order: 1,
    });

    await Video.create({
      section: blockchainSection1._id,
      title: "What is Blockchain?",
      description: "Introduction to blockchain technology",
      videoUrl: "https://www.youtube.com/watch?v=SSo_EIwHSd4",
      duration: "24:35",
      order: 1,
    });

    const blockchainDoc1 = await Document.create({
      section: blockchainSection1._id,
      title: "Blockchain Technology Overview.pdf",
      fileUrl: "https://arxiv.org/pdf/1906.11078.pdf",
      fileType: "pdf",
      order: 1,
    });

    const blockchainDoc2 = await Document.create({
      section: blockchainSection1._id,
      title: "Smart Contracts Guide.pdf",
      fileUrl: "https://arxiv.org/pdf/1910.11143.pdf",
      fileType: "pdf",
      order: 2,
    });

    const blockchainDoc3 = await Document.create({
      section: blockchainSection1._id,
      title: "Ethereum Development.pdf",
      fileUrl: "https://arxiv.org/pdf/2009.05480.pdf",
      fileType: "pdf",
      order: 3,
    });

    blockchainSection1.documents.push(
      blockchainDoc1._id,
      blockchainDoc2._id,
      blockchainDoc3._id
    );
    await blockchainSection1.save();
    blockchainCourse.sections.push(blockchainSection1._id);
    await blockchainCourse.save();

    // ============= COURSE 9: Cloud Computing with AWS =============
    const cloudCourse = await Course.create({
      title: "Cloud Computing with AWS",
      description:
        "Master Amazon Web Services (AWS). Learn EC2, S3, Lambda, DynamoDB, and cloud architecture best practices.",
      thumbnail:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      price: 849,
      instructor: admin._id,
      category: "Cloud & DevOps",
      level: "Intermediate",
      duration: "11 weeks",
      rating: 4.9,
      totalStudents: 1890,
    });

    const cloudSection1 = await Section.create({
      course: cloudCourse._id,
      title: "AWS Fundamentals",
      description: "Getting started with AWS",
      order: 1,
    });

    await Video.create({
      section: cloudSection1._id,
      title: "Introduction to AWS",
      description: "AWS services overview",
      videoUrl: "https://www.youtube.com/watch?v=JIbIYCM48to",
      duration: "26:40",
      order: 1,
    });

    const cloudDoc1 = await Document.create({
      section: cloudSection1._id,
      title: "AWS Cloud Computing Guide.pdf",
      fileUrl: "https://arxiv.org/pdf/1904.06580.pdf",
      fileType: "pdf",
      order: 1,
    });

    const cloudDoc2 = await Document.create({
      section: cloudSection1._id,
      title: "Cloud Architecture Patterns.pdf",
      fileUrl: "https://arxiv.org/pdf/1902.11042.pdf",
      fileType: "pdf",
      order: 2,
    });

    const cloudDoc3 = await Document.create({
      section: cloudSection1._id,
      title: "Serverless Computing.pdf",
      fileUrl: "https://arxiv.org/pdf/1706.03178.pdf",
      fileType: "pdf",
      order: 3,
    });

    cloudSection1.documents.push(cloudDoc1._id, cloudDoc2._id, cloudDoc3._id);
    await cloudSection1.save();
    cloudCourse.sections.push(cloudSection1._id);
    await cloudCourse.save();

    console.log("✅ Database seeded successfully!");
    console.log("\n📝 Demo Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 Admin:      demo.admin@premiumlms.com / Demo@2025");
    console.log("👤 Student:    demo.student@premiumlms.com / Demo@2025");
    console.log("🎓 Instructor: demo.instructor@premiumlms.com / Demo@2025");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📊 Database Statistics:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📚 Courses created: 9");
    console.log("👥 Users created: 3");
    console.log("📑 Sections created: 9");
    console.log("📄 PDF Documents: 24 (for AI summarization testing)");
    console.log("🎥 Videos: 9");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🎯 Courses Available:");
    console.log("1. Machine Learning (Beginner)");
    console.log("2. Full Stack Web Development (Intermediate)");
    console.log("3. Python Programming (Beginner)");
    console.log("4. Digital Marketing (Intermediate)");
    console.log("5. UI/UX Design (Beginner)");
    console.log("6. Data Science with R (Intermediate)");
    console.log("7. Cybersecurity (Intermediate)");
    console.log("8. Blockchain Development (Advanced)");
    console.log("9. Cloud Computing with AWS (Intermediate)");
    console.log("\n🤖 All courses have PDFs for AI summarization testing!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
