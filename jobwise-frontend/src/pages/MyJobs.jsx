import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/jobs/my-jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching my jobs:", err);
      setError(err.response?.data?.msg || "Failed to load your jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        <span className="animate-pulse">Loading your jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchJobs}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["recruiter"]}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Jobs</h1>

        {jobs.length === 0 ? (
          <p className="text-gray-500">You haven’t posted any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border rounded p-4 bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="font-medium">{job.title}</h2>
                  <p className="text-sm text-gray-600">
                    {job.company || "No company name"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/jobs/${job._id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/jobs/${job._id}/applicants`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
}
