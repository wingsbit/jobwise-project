// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public Pages
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import JobDetails from "@/pages/JobDetails";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Protected Pages
import Dashboard from "@/pages/Dashboard";
import MyApplications from "@/pages/MyApplications";
import AIAdvisor from "@/pages/AIAdvisor";
import PostJob from "@/pages/PostJob";
import MyJobs from "@/pages/MyJobs";
import EditJob from "@/pages/EditJob";
import Applicants from "@/pages/Applicants";
import SavedJobs from "@/pages/SavedJobs";

export default function App() {
  return (
    <Routes>
      {/* Wrap everything in Layout so Navbar + Footer are consistent */}
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor"
          element={
            <ProtectedRoute>
              <AIAdvisor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/new"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/edit/:id"
          element={
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/applicants"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
