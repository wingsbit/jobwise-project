import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function FeaturedJobs() {
  const navigate = useNavigate();
  const { user, savedJobs, setSavedJobs } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingJobId, setSavingJobId] = useState(null);

  // Fetch featured jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRes = await api.get("/api/jobs");
        setJobs(jobsRes.data.slice(0, 3));

        // Load saved jobs if user is seeker
        if (user && user.role === "seeker" && savedJobs.length === 0) {
          const savedRes = await api.get("/api/jobs/saved", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          });
          setSavedJobs(savedRes.data.map((job) => job._id));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  // Toggle save/unsave job
  const handleToggleSaveJob = async (jobId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setSavingJobId(jobId);

      if (savedJobs.includes(jobId)) {
        // Unsave
        await api.delete(`/api/jobs/saved/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
      } else {
        // Save
        await api.post(
          `/api/jobs/save/${jobId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        setSavedJobs((prev) => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Error toggling save job:", error);
    } finally {
      setSavingJobId(null);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading featured jobs...</p>;
  }

  if (!jobs.length) {
    return <p className="text-gray-500">No featured jobs available right now.</p>;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Featured Jobs</h2>
        <button
          onClick={() => navigate("/jobs")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All Jobs
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card
            key={job._id}
            className="flex flex-col justify-between hover:shadow-lg transition min-h-[200px]"
          >
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              {job.salary && (
                <p className="text-sm font-medium mt-1">{job.salary}</p>
              )}
            </CardHeader>
            <CardContent className="flex justify-between items-center mt-auto">
              <Button size="sm" onClick={() => navigate(`/jobs/${job._id}`)}>
                View
              </Button>

              {/* Show Save button only for seekers */}
              {user?.role === "seeker" && (
                <Button
                  variant={savedJobs.includes(job._id) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSaveJob(job._id)}
                  disabled={savingJobId === job._id}
                >
                  {savingJobId === job._id
                    ? "Saving..."
                    : savedJobs.includes(job._id)
                    ? "Saved"
                    : "Save"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
