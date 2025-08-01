import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import toast from "react-hot-toast";
import { DEFAULT_AVATAR } from "../constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"; // ✅ fixed path

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchSavedJobs = async () => {
      try {
        setLoadingJobs(true);
        const { data } = await api.get("/users/saved");
        setSavedJobs(data);
      } catch {
        toast.error("Failed to load saved jobs");
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchSavedJobs();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/auth/update", {
        name: name.trim(),
        password: password.trim() || undefined,
      });
      setUser(data.user);
      setPassword("");
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : DEFAULT_AVATAR;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-500 h-40">
        <div className="absolute -bottom-16 left-8 flex items-center space-x-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <span className="absolute bottom-2 right-2 block w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-white/80">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mt-24 p-6 bg-white shadow rounded-xl">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring focus:ring-indigo-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100"
                  value={user.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-full shadow hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </TabsContent>

          {/* Saved */}
          <TabsContent value="saved">
            {loadingJobs ? (
              <p className="text-gray-500">Loading saved jobs...</p>
            ) : savedJobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {savedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 border rounded-lg hover:shadow transition"
                  >
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-500">{job.company}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No saved jobs yet.</p>
            )}
          </TabsContent>

          {/* Applications */}
          <TabsContent value="applications">
            <p className="text-gray-500">Applications tracking coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
