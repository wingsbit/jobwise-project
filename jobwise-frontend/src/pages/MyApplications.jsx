import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Role guard: Jobseeker only
  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
      else if (!["jobseeker", "seeker"].includes(user.role)) navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/api/applications/my");
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    try {
      await api.delete(`/api/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Error withdrawing application:", error);
    }
  };

  if (authLoading || loading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app._id}>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{app.jobTitle}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {app.company} — Applied on {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1 font-medium">
                    Status:{" "}
                    <span className={app.status.includes("Interview") ? "text-green-600" : "text-yellow-600"}>
                      {app.status}
                    </span>
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleWithdraw(app._id)}
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
