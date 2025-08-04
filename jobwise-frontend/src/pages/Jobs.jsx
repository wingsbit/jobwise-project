import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="p-6">Loading jobs...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs available right now.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                {job.salary && (
                  <p className="text-sm font-medium mt-1">{job.salary}</p>
                )}
              </CardHeader>
              <CardContent className="flex justify-between gap-2 mt-auto">
                <Link to={`/jobs/${job._id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // TODO: Hook up saved jobs API
                    console.log(`Save job ${job._id}`);
                  }}
                >
                  Save
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
