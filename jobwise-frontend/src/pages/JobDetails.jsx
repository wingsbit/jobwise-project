import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("coverLetter", coverLetter);
      if (resume) formData.append("resume", resume);

      await api.post(`/api/jobs/${id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/my-applications");
    } catch (err) {
      console.error("Error applying for job:", err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-6">Loading job details...</div>;

  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <p className="text-sm text-gray-500">{job.company}</p>
          <p className="text-sm text-gray-500">{job.location}</p>
          {job.salary && (
            <p className="text-sm font-medium mt-1">{job.salary}</p>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-line">
            {job.description}
          </p>
        </CardContent>
      </Card>

      {/* Apply Form */}
      <Card>
        <CardHeader>
          <CardTitle>Apply Now</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="resume">Resume (PDF or DOC)</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={applying}>
                {applying ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
