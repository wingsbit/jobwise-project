import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchJob = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/jobs/${id}`);
      const job = res.data;

      // Prevent editing if not the job owner
      if (job.createdBy?._id !== user._id) {
        setError("You are not authorized to edit this job.");
        return;
      }

      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        salary: job.salary || "",
        description: job.description || "",
      });
    } catch (err) {
      console.error("Error fetching job:", err);
      setError(err.response?.data?.msg || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id, user._id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/jobs/${id}`, formData);
      navigate("/my-jobs");
    } catch (err) {
      console.error("Error updating job:", err);
      setError(err.response?.data?.msg || "Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading job details...</div>;
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchJob}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["recruiter"]}>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2 h-40"
            required
          />
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </RoleProtectedRoute>
  );
}
