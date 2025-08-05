import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ✅ Check if already applied (only for seekers)
  useEffect(() => {
    const checkIfApplied = async () => {
      if (!user || !["seeker", "jobseeker"].includes(user.role)) return;
      try {
        const res = await api.get("/jobs/my-applications");
        const alreadyApplied = res.data?.some((appliedJob) => appliedJob._id === id);
        setHasApplied(alreadyApplied);
      } catch {
        // Ignore check failure
      }
    };

    checkIfApplied();
  }, [id, user]);

  // ✅ Handle Apply
  const handleApply = async () => {
    setApplying(true);
    setError("");
    try {
      await api.post(`/jobs/apply/${id}`);
      setHasApplied(true);
      navigate("/applications"); // Go to "My Applications"
    } catch (err) {
      console.error("Error applying for job:", err);
      setError(err.response?.data?.msg || "Failed to apply for this job.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-6">Loading job details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          {job.company && <p className="text-sm text-gray-500">{job.company}</p>}
          {job.location && <p className="text-sm text-gray-500">{job.location}</p>}
          {job.salary && (
            <p className="text-sm font-medium mt-1">{job.salary}</p>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </CardContent>
      </Card>

      {/* Actions */}
      {user?.role && ["seeker", "jobseeker"].includes(user.role) && (
        <div className="flex gap-3">
          <Button
            onClick={handleApply}
            disabled={applying || hasApplied}
            className={hasApplied ? "bg-gray-400 cursor-not-allowed" : ""}
          >
            {hasApplied ? "Already Applied" : applying ? "Applying..." : "Apply Now"}
          </Button>
        </div>
      )}

      {user?.role === "recruiter" && job.createdBy?._id === user._id && (
        <div className="flex gap-3">
          <Link
            to={`/jobs/${id}/applicants`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Applicants
          </Link>
        </div>
      )}
    </div>
  );
}
