import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * RoleProtectedRoute - Restricts access based on user role.
 *
 * @param {ReactNode} children - Components to render if allowed.
 * @param {Array<string>} allowedRoles - List of roles allowed to access.
 */
export default function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // ⏳ Still loading auth → show loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  // 🚫 Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 Normalize for consistent matching ("seeker" & "jobseeker" are the same)
  const normalizedRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  // 🚫 Role not allowed → send to appropriate home page
  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    // Recruiters go to My Jobs, others to Dashboard
    return normalizedRole === "recruiter"
      ? <Navigate to="/my-jobs" replace />
      : <Navigate to="/dashboard" replace />;
  }

  // ✅ Allowed → render children
  return children;
}
