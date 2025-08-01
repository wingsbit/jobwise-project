import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import ProfileAvatar from "@/components/auth/ProfileAvatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user, setUser, api } = useAuth();
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
  }, [user, api]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", {
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
    return <div className="p-6 text-center text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-500 h-48 flex items-end px-8 pb-4">
        <ProfileAvatar />
        <div className="ml-6 text-white">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-white/80">{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow rounded-xl">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6 space-y-4">
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <Input value={user.email} disabled className="bg-muted" />
                </div>
                <div>
                  <label className="block text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-500">
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            {loadingJobs ? (
              <p className="text-gray-500">Loading saved jobs...</p>
            ) : savedJobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {savedJobs.map((job) => (
                  <Card key={job._id} className="p-4 hover:shadow-md transition">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-gray-500">{job.company}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No saved jobs yet.</p>
            )}
          </TabsContent>

          <TabsContent value="applications">
            <p className="text-gray-500">Applications tracking coming soon...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
