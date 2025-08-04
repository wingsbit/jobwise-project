import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import JobCard from "@/components/job/JobCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.get("/api/jobs");
        setJobs(jobsRes.data.slice(0, 5));

        const appsRes = await api.get("/api/applications/mine");
        setApplications(appsRes.data.slice(0, 5));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>

      {/* AI Advisor Shortcut */}
      <Card className="bg-blue-50 border-blue-100">
        <CardHeader>
          <CardTitle>Need career advice?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600">
            Use Jobwiser AI to analyze your skills and get tailored job suggestions.
          </p>
          <Link to="/advisor">
            <Button>Go to AI Advisor</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recruiter Quick Actions */}
      {user?.role === "recruiter" && (
        <div className="flex flex-wrap gap-3">
          <Link to="/jobs/new">
            <Button variant="default">+ Post a Job</Button>
          </Link>
          <Link to="/my-jobs">
            <Button variant="secondary">Manage My Jobs</Button>
          </Link>
        </div>
      )}

      {/* Latest Jobs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Latest Job Matches</h2>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
        <Link
          to="/jobs"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          View all jobs →
        </Link>
      </div>

      {/* My Applications */}
      {user?.role === "seeker" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Recent Applications</h2>
          {applications.length === 0 ? (
            <p>You haven't applied for any jobs yet.</p>
          ) : (
            <ul className="space-y-3">
              {applications.map((app) => (
                <li key={app._id} className="border p-3 rounded shadow-sm">
                  <h3 className="font-bold">{app.job?.title}</h3>
                  <p className="text-gray-600">{app.job?.location}</p>
                  <p className="text-xs text-gray-500">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/applications"
            className="inline-block mt-3 text-sm text-blue-600 hover:underline"
          >
            View all applications →
          </Link>
        </div>
      )}
    </div>
  );
}
