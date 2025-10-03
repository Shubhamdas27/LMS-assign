import React, { createContext, useState, useContext, useEffect } from "react";
import { getStoredUser, isAuthenticated as checkAuth } from "../services/auth";

/**
 * Auth Context
 * Manages authentication state across the app
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = getStoredUser();
    const hasToken = checkAuth();

    if (storedUser && hasToken) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    updateUser,
    clearUser,
    isAdmin: user?.role === "admin",
    isInstructor:
      user?.role === "instructor" ||
      user?.name === "Demo Instructor" ||
      user?.email?.includes("instructor"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
