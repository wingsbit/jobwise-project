import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get("/api/applications/my"); // Adjust endpoint if needed
        setApplicants(res.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/applications/${id}`);
      setApplicants((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Error removing applicant:", err);
    }
  };

  if (loading) return <div className="p-6">Loading applicants...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Applicants</h1>

      {applicants.length === 0 ? (
        <p className="text-gray-600">No one has applied yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applicants.map((app) => (
            <Card key={app._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg">{app.name}</CardTitle>
                <p className="text-sm text-gray-500">{app.email}</p>
                {app.phone && <p className="text-sm text-gray-500">{app.phone}</p>}
                {app.coverLetter && (
                  <p className="text-sm mt-2 text-gray-700">{app.coverLetter}</p>
                )}
              </CardHeader>
              <CardContent className="flex justify-between gap-2 mt-auto">
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">View Resume</Button>
                  </a>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(app._id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
