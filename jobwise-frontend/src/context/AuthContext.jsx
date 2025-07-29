// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;
  const API = "http://localhost:5000/api/auth";

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(`${API}/me`);
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/login`, { email, password });
      toast.success("Login successful");
      setUser(data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  const register = async (email, password) => {
    try {
      const { data } = await axios.post(`${API}/register`, {
        email,
        password,
      });
      toast.success("Signup successful");
      setUser(data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/logout`);
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
