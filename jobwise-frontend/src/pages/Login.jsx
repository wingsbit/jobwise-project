import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("📤 Sending login request:", { email, password });

    try {
      const cleanedEmail = email.toLowerCase().trim();
      const res = await api.post("/auth/login", { email: cleanedEmail, password });
      console.log("✅ Login success:", res.data);

      const { token, user } = res.data;
      localStorage.setItem("token", token);

      if (user) {
        setUser(user);
      } else {
        try {
          const meRes = await api.get("/auth/me");
          setUser(meRes.data.user);
        } catch (err) {
          console.error("❌ Failed to fetch user after login", err);
        }
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
