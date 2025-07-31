// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const api = axios.create({
    baseURL: API,
  });

  // Add token to every request
  api.interceptors.request.use((config) => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
    return config;
  });

  const getCurrentUser = async () => {
    try {
      const { data } = await api.get("/users/profile");
      setUser(data.user);
    } catch (err) {
      console.error("❌ /users/profile error:", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      toast.success("Login successful");
      await getCurrentUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email: email.toLowerCase().trim(),
        password,
      });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      toast.success("Signup successful");
      await getCurrentUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  useEffect(() => {
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
