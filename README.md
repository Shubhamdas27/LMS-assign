# 🚀 LMS Platform - Production Ready

A modern Learning Management System built with React, Node.js, Express, and MongoDB.

## ✨ Features

- 👤 **User Authentication** (Admin & Student roles)
- 📚 **9 Premium Courses** with video content
- 📄 **24 PDF Documents** with AI summarization
- 🤖 **AI-Powered Document Summarization** (Gemini AI)
- 💳 **Payment Integration** (Razorpay)
- 📱 **Responsive Design** with Bootstrap
- 🔒 **Protected Routes** and role-based access
- 📊 **Progress Tracking** for students
- 🎨 **Premium UI/UX** with animations

## 🏗️ Tech Stack

**Frontend:**

- React 18 + Vite
- Bootstrap 5
- React Router v6
- AOS Animations
- React Icons

**Backend:**

- Node.js + Express
- MongoDB (Atlas)
- JWT Authentication
- Gemini AI Integration
- Cloudinary (File Upload)
- Razorpay (Payments)

## 🚀 Quick Start (Production)

### 1. **Start the Platform**

```bash
# Double click this file or run in terminal:
D:\LMS\start-production.bat
```

### 2. **Access the Platform**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

### 3. **Test Credentials**

```
👑 Admin Login:
Email: admin@lms.com
Password: Admin@123

👤 Student Login:
Email: student@lms.com
Password: Student@123
```

## 📋 Available Courses

1. **Machine Learning** (Beginner) - 2 PDFs
2. **Full Stack Web Development** (Intermediate) - 2 PDFs
3. **Python Programming** (Beginner) - 2 PDFs
4. **Digital Marketing** (Intermediate) - 3 PDFs
5. **UI/UX Design** (Beginner) - 2 PDFs
6. **Data Science with R** (Intermediate) - 3 PDFs
7. **Cybersecurity Essentials** (Intermediate) - 2 PDFs
8. **Blockchain Development** (Advanced) - 3 PDFs
9. **Cloud Computing with AWS** (Intermediate) - 3 PDFs

## 🔧 Manual Setup (if needed)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Seeding

```bash
cd backend
node seed.js
```

## 🌐 Environment Configuration

### Development (.env)

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: MongoDB Atlas

### Production (.env.production)

- Enhanced security settings
- Production database
- Optimized rate limiting

## 📱 Key Features Implemented

### Authentication System

- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Auto-redirect logic
- ✅ Persistent login sessions

### Course Management

- ✅ Course listing with search
- ✅ Course details with sections
- ✅ Video player integration
- ✅ Document viewer
- ✅ Progress tracking

### AI Integration

- ✅ PDF document summarization
- ✅ Gemini AI integration
- ✅ Real-time processing
- ✅ Error handling

### Payment System

- ✅ Razorpay integration
- ✅ Course enrollment
- ✅ Payment verification
- ✅ Order management

### Admin Panel

- ✅ User management
- ✅ Course creation/editing
- ✅ Analytics dashboard
- ✅ Content management

## 🔐 Security Features

- JWT token authentication
- CORS protection
- Rate limiting
- Input validation
- Password hashing
- Protected API endpoints

## 📊 Database Schema

- **Users** (admin, student roles)
- **Courses** (title, description, price, etc.)
- **Sections** (course chapters)
- **Videos** (course content)
- **Documents** (PDFs with AI features)
- **Progress** (student tracking)
- **Payments** (enrollment records)

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid credentials" error:**

   - Ensure backend is running
   - Check database connection
   - Verify test credentials

2. **CORS errors:**

   - Check CORS_ORIGIN in .env
   - Ensure frontend/backend ports match

3. **Courses not loading:**

   - Run database seeding: `node seed.js`
   - Check MongoDB connection

4. **AI features not working:**
   - Verify Gemini API key
   - Check document URLs are accessible

## 📁 Project Structure

```
D:\LMS\
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   └── config/          # Configuration
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   └── utils/           # Helper functions
├── start-production.bat      # Quick start script
└── README.md                # This file
```

## 🎯 Production Deployment

For actual production deployment:

1. **Frontend:** Deploy to Vercel/Netlify
2. **Backend:** Deploy to Heroku/Railway
3. **Database:** MongoDB Atlas (production cluster)
4. **CDN:** Cloudinary for file storage
5. **Domain:** Custom domain with SSL

## 📞 Support

For any issues or questions:

- Check the troubleshooting section
- Review console logs
- Ensure all services are running

---

## 🚀 **Ready to Launch!**

Run `start-production.bat` and your LMS platform will be live!

**Admin Dashboard:** http://localhost:3000/admin
**Student Portal:** http://localhost:3000/dashboard
