import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import ProfileAvatar from "@/components/auth/ProfileAvatar";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { user, setUser, api } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);
      const { data } = await api.put("/users/profile", {
        name: name.trim(),
        email: email.trim(),
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
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r shadow-sm p-6">
        <ProfileAvatar />

        <hr className="my-6 border-border" />

        <Button variant="ghost" className="justify-start w-full" onClick={() => toast("Saved Jobs Coming Soon")}>
          Saved Jobs
        </Button>
        <Button variant="ghost" className="justify-start w-full" onClick={() => toast("Applications Coming Soon")}>
          My Applications
        </Button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Edit Profile</h2>

          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={email} disabled className="bg-muted" />
          </div>

          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            onClick={handleProfileUpdate}
            disabled={saving}
            className="bg-gradient-to-r from-green-500 to-emerald-500"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Card>
      </main>
    </div>
  );
}
