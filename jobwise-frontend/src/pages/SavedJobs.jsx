import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function SavedJobs() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved jobs (placeholder API call for now)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Replace with real backend call when implemented
        // const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/saved`, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        //   withCredentials: true,
        // });
        // setSavedJobs(res.data.jobs);

        // Placeholder
        setSavedJobs([
          {
            id: 1,
            title: "Frontend Developer",
            company: "TechCorp",
            location: "Remote",
          },
          {
            id: 2,
            title: "Backend Engineer",
            company: "CodeWorks",
            location: "Tbilisi, Georgia",
          },
        ]);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleRemove = (id) => {
    // TODO: connect to backend remove route
    setSavedJobs((prev) => prev.filter((job) => job.id !== id));
  };

  if (loading) return <div className="p-6">Loading saved jobs...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Saved Jobs</h1>
      {savedJobs.length === 0 ? (
        <p className="text-gray-600">No saved jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {savedJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {job.company} — {job.location}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(job.id)}
                >
                  Remove
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
