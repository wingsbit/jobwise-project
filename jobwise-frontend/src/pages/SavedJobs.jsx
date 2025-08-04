import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SavedJobs() {
  const { user, savedJobs, setSavedJobs } = useAuth();
  const [savedJobDetails, setSavedJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch full job details for saved jobs (Seekers only)
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (user.role !== "seeker") {
      setErrorMsg("This feature is only available to job seekers.");
      setLoading(false);
      return;
    }

    const fetchSavedJobDetails = async () => {
      try {
        const res = await api.get("/api/jobs/saved", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setSavedJobDetails(res.data);
      } catch (error) {
        if (error.response?.status === 403) {
          setErrorMsg("This feature is only available to job seekers.");
        } else {
          console.error("Error fetching saved jobs:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobDetails();
  }, [user, savedJobs]);

  // Remove saved job
  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await api.delete(`/api/jobs/saved/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setSavedJobs((prev) => prev.filter((jobId) => jobId !== id));
    } catch (error) {
      console.error("Error removing saved job:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (!user) {
    return <p className="p-6 text-gray-600">Please log in to view saved jobs.</p>;
  }

  if (loading) return <div className="p-6">Loading saved jobs...</div>;

  if (errorMsg) {
    return <div className="p-6 text-red-500 font-medium">{errorMsg}</div>;
  }

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
