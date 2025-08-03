import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import AppShell from "@/components/layout/AppShell";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar
      ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
      : ""
  );
  const [loading, setLoading] = useState(false);

  // Handle avatar selection & preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      setLoading(true);
      let uploadedAvatar = user?.avatar;

      // 1️⃣ Upload avatar if selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const uploadRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/upload-avatar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        uploadedAvatar = uploadRes.data.filename;
      }

      // 2️⃣ Update name/password/avatar filename
      const updateRes = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        {
          name,
          ...(password && { password }),
          ...(uploadedAvatar && { avatar: uploadedAvatar }),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      // 3️⃣ Update AuthContext immediately
      setUser(updateRes.data.user);
      setPassword("");
      setAvatarFile(null);

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Profile update error:", err.response?.data || err.message);
      alert("❌ Error updating profile. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-lg mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Edit Profile</h1>

        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={avatarPreview}
              alt={user?.name || "Avatar"}
              className="object-cover"
            />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="max-w-xs"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input value={user?.email} disabled className="bg-gray-100" />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <Input
            type="password"
            placeholder="Leave blank to keep current"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <Button className="w-full" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </AppShell>
  );
}
