import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications (placeholder until backend is connected)
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // TODO: Connect to backend when ready
        // const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications`, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        //   withCredentials: true
        // });
        // setApplications(res.data);

        // Placeholder data
        setApplications([
          {
            id: 1,
            jobTitle: "Frontend Developer",
            company: "TechCorp",
            status: "Interview Scheduled",
            appliedDate: "2025-07-28",
          },
          {
            id: 2,
            jobTitle: "Backend Engineer",
            company: "CodeWorks",
            status: "Under Review",
            appliedDate: "2025-07-20",
          },
        ]);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleWithdraw = (id) => {
    // TODO: Connect to backend withdraw route
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  if (loading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{app.jobTitle}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {app.company} — Applied on {app.appliedDate}
                  </p>
                  <p className="text-sm mt-1 font-medium">
                    Status:{" "}
                    <span
                      className={`${
                        app.status.includes("Interview")
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleWithdraw(app.id)}
                >
                  Withdraw
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
