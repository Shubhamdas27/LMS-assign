import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import AOS from "aos";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoursePage from "./pages/CoursePage";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import LearningInterface from "./pages/LearningInterface";
import AdminPanel from "./pages/AdminPanel";
import InstructorDashboard from "./pages/InstructorDashboard";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";
import "./App.css";

/**
 * Main App Component
 */
function App() {
  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div
          className="d-flex flex-column min-vh-100"
          style={{ position: "relative", zIndex: 1 }}
        >
          <Navbar />

          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/courses" element={<CoursePage />} />
              <Route path="/courses/:id" element={<CourseDetail />} />

              {/* Auth Routes - Redirect if already logged in */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learning/:id"
                element={
                  <ProtectedRoute>
                    <LearningInterface />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Instructor Routes */}
              <Route
                path="/instructor"
                element={
                  <ProtectedRoute>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
