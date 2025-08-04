// src/pages/MyApplications.jsx
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/api/applications/mine");
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="border p-4 rounded">
              <h2 className="font-semibold">{app.job?.title}</h2>
              <p>{app.job?.location}</p>
              <p>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
