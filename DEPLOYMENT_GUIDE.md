# Backend Deployment Guide for Render

## Steps to Deploy Backend to Render.com

### 1. Create a Render Account

- Go to https://render.com and sign up/login
- Connect your GitHub account

### 2. Deploy the Backend

1. Click "New +" in Render dashboard
2. Select "Web Service"
3. Connect your GitHub repository: `https://github.com/Shubhamdas27/LMS-assign.git`
4. Configure the service:
   - **Name**: `lms-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://shubham:272004@cluster1.oantxbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1
JWT_SECRET=shubhamDas12345678
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLOUDINARY_CLOUD_NAME=Test
CLOUDINARY_API_KEY=846215476678533
CLOUDINARY_API_SECRET=TicIwfqBM6wCeR8k6R8664f6gQc
GEMINI_API_KEY=AIzaSyALTNnxY7Eal3KKSMqR_2Mq02mobqZoUHw
RAZORPAY_KEY_ID=rzp_test_ROzVGNL06sDvtF
RAZORPAY_KEY_SECRET=vsEJ8Ukkg2lSDTBq4Y15COVa
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=*
ADMIN_EMAIL=admin@lms.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
```

### 4. Expected Backend URL

After deployment, your backend will be available at:
`https://lms-backend-xxxx.onrender.com`

Replace `xxxx` with the actual identifier Render assigns.

### 5. Update Frontend Environment

Once deployed, update the frontend environment variable:
`VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

## Current Status

- ✅ Frontend deployed to Vercel: https://front-g4knxto8i-subhdas272004-gmailcoms-projects.vercel.app
- ⏳ Backend ready for Render deployment (follow steps above)
