import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext(); // ✅ Named export

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API root (no /auth here, we add that in each call)
  const API = "http://localhost:5000/api";

  // ✅ Axios instance with token support
  const api = axios.create({
    baseURL: API,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Get logged-in user
  const getCurrentUser = async () => {
    try {
      const { data } = await api.get("/auth/me"); // ✅ correct path
      setUser(data.user);
    } catch (err) {
      console.error("❌ /me error:", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { // ✅ correct path
        email: email.toLowerCase().trim(),
        password,
      });
      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      await getCurrentUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  // ✅ Register
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { // ✅ correct path
        name,
        email: email.toLowerCase().trim(),
        password,
      });
      localStorage.setItem("token", data.token);
      toast.success("Signup successful");
      await getCurrentUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // ✅ correct path
    } catch {
      // ignore backend logout error
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out");
    }
  };

  // ✅ Auto-fetch user on load
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
