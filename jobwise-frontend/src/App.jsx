import { Routes, Route } from "react-router-dom";
import Dashboard from "@pages/Dashboard";
import NotFound from "@pages/NotFound";
import Login from "@pages/Login";
import Signup from "@pages/Signup";
import Home from "@pages/Home";
import Profile from "@pages/Profile";
import AppShell from "@components/layout/AppShell"; // ✅ new layout
import ProtectedRoute from "@components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* All routes share AppShell */}
      <Route path="/" element={<AppShell />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
