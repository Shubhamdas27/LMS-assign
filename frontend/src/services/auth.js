import api from "./api";

/**
 * Authentication Service
 */

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  const user = getStoredUser();
  return user && user.role === "admin";
};
