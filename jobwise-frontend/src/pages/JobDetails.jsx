import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!coverLetter.trim()) return;
    setApplying(true);
    try {
      await api.post("/api/applications", {
        jobId: id,
        coverLetter,
      });
      setApplied(true);
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-6">Loading job...</div>;

  if (!job) return <div className="p-6">Job not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-gray-600">{job.location}</p>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </CardContent>
      </Card>

      {/* Apply Now */}
      {!applied ? (
        <Card>
          <CardHeader>
            <CardTitle>Apply Now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full h-32 rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a cover letter..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <Button
              onClick={handleApply}
              disabled={applying}
              className="w-full"
            >
              {applying ? "Submitting..." : "Submit Application"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
          ✅ Application submitted successfully!
        </div>
      )}
    </div>
  );
}
