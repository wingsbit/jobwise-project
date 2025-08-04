import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/api/applications");
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <Card key={app._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
                <p className="text-sm text-gray-500">{app.company}</p>
                <p className="text-sm text-gray-500">{app.location}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="flex justify-between items-center mt-auto">
                <Link to={`/jobs/${app.jobId}`}>
                  <Button variant="outline" size="sm">View Job</Button>
                </Link>
                {app.status && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      app.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
