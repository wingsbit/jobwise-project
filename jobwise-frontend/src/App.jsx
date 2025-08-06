import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";

// Public Pages
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import JobDetails from "@/pages/JobDetails";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Pricing from "@/pages/Pricing";
import Terms from "@/pages/Terms";
import PrivacyPolicy from "@/pages/PrivacyPolicy"; // ✅ fixed import

// Protected Pages (All Users)
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

// Job Seeker Pages
import MyApplications from "@/pages/MyApplications";
import AIAdvisor from "@/pages/AIAdvisor";
import SavedJobs from "@/pages/SavedJobs";

// Recruiter Pages
import PostJob from "@/pages/PostJob";
import MyJobs from "@/pages/MyJobs";
import EditJob from "@/pages/EditJob";
import Applicants from "@/pages/Applicants";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* ✅ fixed */}

        {/* Protected Routes (All Users) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Job Seeker Only */}
        <Route
          path="/applications"
          element={
            <RoleProtectedRoute allowedRoles={["jobseeker", "seeker"]}>
              <MyApplications />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/advisor"
          element={
            <RoleProtectedRoute allowedRoles={["jobseeker", "seeker"]}>
              <AIAdvisor />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <RoleProtectedRoute allowedRoles={["jobseeker", "seeker"]}>
              <SavedJobs />
            </RoleProtectedRoute>
          }
        />

        {/* Recruiter Only */}
        <Route
          path="/jobs/new"
          element={
            <RoleProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <RoleProtectedRoute allowedRoles={["recruiter"]}>
              <MyJobs />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/edit"
          element={
            <RoleProtectedRoute allowedRoles={["recruiter"]}>
              <EditJob />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/applicants"
          element={
            <RoleProtectedRoute allowedRoles={["recruiter"]}>
              <Applicants />
            </RoleProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
