// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Create shared Axios instance
const api = axios.create({ baseURL: API_URL });

// ✅ Attach token to all requests
api.interceptors.request.use((config) => {
  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    config.headers.Authorization = `Bearer ${savedToken}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ✅ Get current user (on refresh)
  const getCurrentUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (err) {
      console.error("❌ /auth/me error:", err.response?.data || err.message);
      logout(); // auto logout if token invalid
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });

      // Save token
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // ✅ Store user directly without waiting for /auth/me
      setUser(data.user);

      toast.success("Login successful");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  // ✅ Register
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email: email.toLowerCase().trim(),
        password,
      });

      // Save token
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // ✅ Store user directly
      setUser(data.user);

      toast.success("Signup successful");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  // ✅ Auto-fetch on refresh
  useEffect(() => {
    if (token && !user) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, loading, login, register, logout, getCurrentUser, api }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
