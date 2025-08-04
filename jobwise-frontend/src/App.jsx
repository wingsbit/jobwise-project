import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Jobs from "@/pages/Jobs";
import JobDetails from "@/pages/JobDetails";
import MyApplications from "@/pages/MyApplications";
import AIAdvisor from "@/pages/AIAdvisor";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import PostJob from "@/pages/PostJob";
import MyJobs from "@/pages/MyJobs";
import EditJob from "@/pages/EditJob";
import Applicants from "@/pages/Applicants";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      {/* Protected routes */}
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

      {/* Recruiter routes */}
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
    </Routes>
  );
}
