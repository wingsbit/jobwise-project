import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";

export default function Applicants() {
  const { id } = useParams(); // jobId from URL
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shortlisted: "bg-blue-100 text-blue-800",
    Rejected: "bg-red-100 text-red-800",
    Hired: "bg-green-100 text-green-800",
  };

  const fetchApplicants = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/jobs/${id}/applicants`);
      setApplicants(res.data || []);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError(err.response?.data?.msg || "Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await api.put(`/jobs/${id}/applicants/${applicantId}/status`, { status: newStatus });

      // Update UI instantly
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === applicantId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Try again.");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  if (loading) return <div className="p-6">Loading applicants...</div>;

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchApplicants}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["recruiter"]}>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Applicants</h1>

        {applicants.length === 0 ? (
          <p className="text-gray-500">No applicants yet for this job.</p>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <div
                key={applicant._id}
                className="flex items-center justify-between border rounded p-4 bg-white shadow-sm"
              >
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      applicant.avatar
                        ? `${import.meta.env.VITE_API_URL}/uploads/${applicant.avatar}`
                        : "/default-avatar.png"
                    }
                    alt={applicant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{applicant.name}</p>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    {applicant.appliedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Applied on{" "}
                        {new Date(applicant.appliedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {/* Status Badge */}
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                        statusColors[applicant.status] || statusColors.Pending
                      }`}
                    >
                      {applicant.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 items-end">
                  {/* Status Dropdown */}
                  <select
                    value={applicant.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(applicant._id, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {applicant.resume && (
                      <a
                        href={`${import.meta.env.VITE_API_URL}/uploads/${applicant.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Resume
                      </a>
                    )}
                    <Link
                      to={`mailto:${applicant.email}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Email
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleProtectedRoute>
  );
}
