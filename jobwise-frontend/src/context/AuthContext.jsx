import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global saved jobs state
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobsLoading, setSavedJobsLoading] = useState(false);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        fetchSavedJobs();
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch saved jobs globally
  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      setSavedJobsLoading(true);
      const res = await api.get("/api/jobs/saved", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      setSavedJobs(res.data.map((job) => job._id));
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setSavedJobsLoading(false);
    }
  };

  // Toggle save/unsave job globally
  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        // Unsave
        await api.delete(`/api/jobs/saved/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
      } else {
        // Save
        await api.post(
          `/api/jobs/save/${jobId}`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
          }
        );
        setSavedJobs((prev) => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Error toggling save job:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        savedJobs,
        savedJobsLoading,
        fetchSavedJobs,
        toggleSaveJob,
        setSavedJobs, // allow manual update from components
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
