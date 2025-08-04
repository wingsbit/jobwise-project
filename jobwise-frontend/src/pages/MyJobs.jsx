import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs/mine");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  if (loading) return <div className="p-6">Loading your jobs...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Job Postings</h1>
      <Link
        to="/jobs/new"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block mb-4"
      >
        + Post New Job
      </Link>

      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.location}</p>
              <div className="mt-2 space-x-3">
                <button
                  onClick={() => navigate(`/jobs/edit/${job._id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteJob(job._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <Link
                  to={`/jobs/${job._id}/applicants`}
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                >
                  View Applicants
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
