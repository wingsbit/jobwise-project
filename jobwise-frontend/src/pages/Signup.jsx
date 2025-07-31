import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use context

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth(); // ✅ call backend through AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Sending signup request:", { name, email, password });

    try {
      await register(name, email, password);
      console.log("✅ Signup successful, redirecting to dashboard");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
