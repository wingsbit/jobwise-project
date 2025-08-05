import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SavedJobs() {
  const { user, savedJobs, setSavedJobs, loading: authLoading } = useAuth();
  const [savedJobDetails, setSavedJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  // ✅ Role guard: Jobseeker only
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!["jobseeker", "seeker"].includes(user.role)) {
        navigate("/dashboard");
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchSavedJobDetails = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/api/jobs/saved");
        setSavedJobDetails(res.data);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobDetails();
  }, [user, savedJobs]);

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await api.delete(`/api/jobs/saved/${id}`);
      setSavedJobs((prev) => prev.filter((jobId) => jobId !== id));
    } catch (error) {
      console.error("Error removing saved job:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || loading) return <div className="p-6">Loading saved jobs...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Saved Jobs</h1>
      {savedJobDetails.length === 0 ? (
        <p className="text-gray-600">No saved jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {savedJobDetails.map((job) => (
            <Card key={job._id}>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {job.company || "Unknown Company"} — {job.location}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(job._id)}
                  disabled={removingId === job._id}
                >
                  {removingId === job._id ? "Removing..." : "Remove"}
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
