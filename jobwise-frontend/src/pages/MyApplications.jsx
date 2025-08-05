import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shortlisted: "bg-blue-100 text-blue-800",
    Rejected: "bg-red-100 text-red-800",
    Hired: "bg-green-100 text-green-800",
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/jobs/my-applications");
      setApplications(res.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.response?.data?.msg || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading your applications...
      </div>
    );
  }

  if (error) {
    return (
      <RoleProtectedRoute allowedRoles={["jobseeker", "seeker"]}>
        <div className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </RoleProtectedRoute>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["jobseeker", "seeker"]}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Applications</h1>

        {applications.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            <p>You haven't applied to any jobs yet.</p>
            <Link
              to="/jobs"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((job) => (
              <div
                key={job._id}
                className="border rounded p-4 bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="font-medium">{job.title}</h2>
                  {job.company && (
                    <p className="text-sm text-gray-600">{job.company}</p>
                  )}
                  {job.location && (
                    <p className="text-sm text-gray-500">{job.location}</p>
                  )}
                  {job.appliedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Applied on{" "}
                      {new Date(job.appliedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  {/* Status */}
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                      statusColors[job.status] || statusColors.Pending
                    }`}
                  >
                    {job.status || "Pending"}
                  </span>
                </div>
                <Link
                  to={`/jobs/${job._id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  View Job
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
}
