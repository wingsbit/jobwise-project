import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PostJob() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  // ✅ Role guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
      else if (user.role !== "recruiter") navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => setJob({ ...job, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/jobs", job);
      navigate("/my-jobs");
    } catch (err) {
      console.error("Error posting job:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Post a Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabelInput label="Job Title" name="title" value={job.title} onChange={handleChange} required />
            <LabelInput label="Company" name="company" value={job.company} onChange={handleChange} required />
            <LabelInput label="Location" name="location" value={job.location} onChange={handleChange} required />
            <LabelInput label="Salary" name="salary" value={job.salary} onChange={handleChange} />
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                placeholder="Write the job description..."
                rows={5}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">{loading ? "Posting..." : "Post Job"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LabelInput({ label, name, value, onChange, required }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} value={value} onChange={onChange} required={required} />
    </div>
  );
}
