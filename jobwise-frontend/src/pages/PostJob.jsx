import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function PostJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/api/jobs", {
        title,
        description,
        location,
        salary,
        skills: skills.split(",").map((s) => s.trim()),
      });

      setSuccess("Job posted successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to post job");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handlePostJob} className="space-y-3">
        <input
          type="text"
          placeholder="Job Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Job Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Salary (optional)"
          className="w-full border p-2 rounded"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <input
          type="text"
          placeholder="Required Skills (comma separated)"
          className="w-full border p-2 rounded"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
