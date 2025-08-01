import { useAuth } from "@context/AuthContext";
import { useState, useEffect } from "react";
import ProfileAvatar from "@components/auth/ProfileAvatar";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, setUser, api } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setName(user.name || "");
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      const { data } = await api.put("/users/profile", {
        name: name.trim(),
        password: password || undefined
      });
      setUser(data.user);
      setPassword("");
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r shadow-sm p-6 flex flex-col items-center">
        <ProfileAvatar />

        <hr className="my-6 w-full border-gray-200" />

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => toast("Saved Jobs Coming Soon")}
        >
          Saved Jobs
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => toast("Applications Coming Soon")}
        >
          My Applications
        </Button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="block text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />

            <label className="block text-sm font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6"
            />

            <Button
              onClick={handleProfileUpdate}
              disabled={saving}
              className="w-full"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
