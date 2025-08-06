import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobsLoading, setSavedJobsLoading] = useState(false);

  // ✅ Fetch current user on page refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await api.get("/auth/me");
        setUser(res.data);
        fetchSavedJobs(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch saved jobs
  const fetchSavedJobs = async (currentUser = user) => {
    if (!currentUser) return;
    try {
      setSavedJobsLoading(true);
      const res = await api.get("/jobs/saved");
      setSavedJobs(res.data.map((job) => job._id));
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setSavedJobsLoading(false);
    }
  };

  // ✅ Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    await fetchSavedJobs(res.data.user);
    return res.data.user;
  };

  // ✅ Signup
  const signup = async (name, email, password, role) => {
    const res = await api.post("/auth/register", { name, email, password, role });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    await fetchSavedJobs(res.data.user);
    return res.data.user;
  };

  // ✅ Update Profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);

      // Refetch saved jobs if skills changed
      if (formData.has("skills")) {
        await fetchSavedJobs(updatedUser);
      }

      // 🔹 Let Dashboard know skills changed → refresh recommendations
      document.dispatchEvent(new CustomEvent("skillsUpdated"));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        message: error.response?.data?.msg || "Failed to update profile",
      };
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSavedJobs([]);
  };

  // ✅ Save / Unsave job
  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await api.delete(`/jobs/saved/${jobId}`);
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
      } else {
        await api.post(`/jobs/save/${jobId}`);
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
        login,
        signup,
        logout,
        fetchSavedJobs,
        toggleSaveJob,
        setSavedJobs,
        updateProfile, // 🔹 Used in Profile page
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
