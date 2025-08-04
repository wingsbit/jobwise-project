import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";

export default function Applicants() {
  const { id } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/api/applications/job/${id}`);
        setApplicants(res.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applicants</h1>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul className="space-y-3">
          {applicants.map((app) => (
            <li key={app._id} className="border p-3 rounded">
              <h3 className="font-bold">{app.applicant?.name}</h3>
              <p>{app.applicant?.email}</p>
              <p className="text-gray-600">{app.coverLetter}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
