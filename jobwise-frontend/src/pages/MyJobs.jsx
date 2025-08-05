import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyJobs() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Role guard: Recruiter only
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "recruiter") {
        navigate("/dashboard");
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get("/api/jobs/my");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching my jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/api/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) return <div className="p-6">Loading your jobs...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <Button onClick={() => navigate("/jobs/new")}>+ Post New Job</Button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-600">You haven’t posted any jobs yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
              </CardHeader>
              <CardContent className="flex justify-between gap-2 mt-auto">
                <Link to={`/jobs/${job._id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                <Link to={`/jobs/edit/${job._id}`}>
                  <Button size="sm">Edit</Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(job._id)}
                  disabled={deletingId === job._id}
                >
                  {deletingId === job._id ? "Deleting..." : "Delete"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
