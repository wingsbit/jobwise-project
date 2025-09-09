/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import api from "@/lib/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savedJobs, setSavedJobs] = useState([])
  const [savedJobsLoading, setSavedJobsLoading] = useState(false)

  // fetch logged-in user
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      // main user data
      const res = await api.get("/auth/me")
      let fetchedUser = res.data

      // optional: career roadmap
      if (!fetchedUser.careerRoadmap) {
        try {
          const roadmapRes = await api.get("/advisor/roadmap")
          fetchedUser = {
            ...fetchedUser,
            careerRoadmap: roadmapRes.data.roadmap || "",
          }
        } catch {
          console.warn("Roadmap fetch failed (not blocking login).")
        }
      }

      setUser(fetchedUser)
      await fetchSavedJobs(fetchedUser)
    } catch (error) {
      console.error("Error fetching user:", error)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // saved jobs
  const fetchSavedJobs = async (currentUser = user) => {
    if (!currentUser) return
    try {
      setSavedJobsLoading(true)
      const res = await api.get("/jobs/saved")
      setSavedJobs(res.data.map((job) => job._id))
    } catch (error) {
      console.error("Error fetching saved jobs:", error)
    } finally {
      setSavedJobsLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })
    localStorage.setItem("token", res.data.token)
    await refreshUser()
    return res.data.user
  }

  const signup = async (name, email, password, role) => {
    const res = await api.post("/auth/register", { name, email, password, role })
    localStorage.setItem("token", res.data.token)
    await refreshUser()
    return res.data.user
  }

  const updateProfile = async (formData) => {
    try {
      const res = await api.patch("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      await refreshUser()

      if (formData.has("skills")) {
        document.dispatchEvent(new CustomEvent("skillsUpdated"))
      }

      return { success: true, user: res.data.user }
    } catch (error) {
      console.error("Error updating profile:", error)
      return {
        success: false,
        message: error.response?.data?.msg || "Failed to update profile",
      }
    }
  }

  const saveRoadmap = async (advice) => {
    try {
      await api.post("/advisor/save", { advice })
      await refreshUser()
    } catch (error) {
      console.error("Error saving roadmap:", error)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setSavedJobs([])
  }

  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await api.delete(`/jobs/saved/${jobId}`)
        setSavedJobs((prev) => prev.filter((id) => id !== jobId))
      } else {
        await api.post(`/jobs/save/${jobId}`)
        setSavedJobs((prev) => [...prev, jobId])
      }
    } catch (error) {
      console.error("Error toggling save job:", error)
    }
  }

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
        updateProfile,
        refreshUser,
        saveRoadmap,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
