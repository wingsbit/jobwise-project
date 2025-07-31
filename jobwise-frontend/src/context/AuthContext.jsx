import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api/auth";

  // ✅ Create a custom axios instance that includes token
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

  const getCurrentUser = async () => {
    try {
      const { data } = await api.get("/me");
      console.log("✅ /me response:", data);
      setUser(data.user);
    } catch (err) {
      console.error("❌ /me error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/login`, { email, password });
      toast.success("Login successful");
      localStorage.setItem("token", data.token);
      await getCurrentUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API}/register`, {
        name,
        email,
        password,
      });
      toast.success("Signup successful");
      localStorage.setItem("token", data.token);
      await getCurrentUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout"); // you can skip this if backend doesn't need it
      localStorage.removeItem("token");
      toast.success("Logged out");
      setUser(null);
    } catch (err) {
      toast.error("Logout failed");
    }
  };
  

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
