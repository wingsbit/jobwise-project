import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        const job = res.data;
        setTitle(job.title);
        setDescription(job.description);
        setLocation(job.location);
        setSalary(job.salary || "");
        setSkills(job.skills?.join(", ") || "");
      } catch (error) {
        console.error("Error loading job:", error);
      }
    };
    fetchJob();
  }, [id]);

  const updateJob = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/jobs/${id}`, {
        title,
        description,
        location,
        salary,
        skills: skills.split(",").map((s) => s.trim()),
      });
      navigate("/my-jobs");
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={updateJob} className="space-y-3">
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
          placeholder="Salary"
          className="w-full border p-2 rounded"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          className="w-full border p-2 rounded"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
