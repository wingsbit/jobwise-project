import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const { user, setUser } = useAuth(); // ✅ so we can instantly update avatar

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.avatar
      ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
      : "/default-avatar.png"
  );

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // temporary preview
    }
  };

  const handleUploadAvatar = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("avatar", file);

    // ✅ Always read token from localStorage to avoid null issues
    const uploadToken = localStorage.getItem("token");
    console.log("UPLOAD TOKEN BEING SENT:", uploadToken);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${uploadToken}`,
          },
        }
      );

      // ✅ Update avatar instantly without refetching /profile
      setUser((prev) => ({ ...prev, avatar: data.user.avatar }));
      setPreview(`${import.meta.env.VITE_API_URL}/uploads/${data.user.avatar}`);

      alert("Profile picture updated!");
      setFile(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    const uploadToken = localStorage.getItem("token");

    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        { name, email, password: password || undefined },
        {
          headers: {
            Authorization: `Bearer ${uploadToken}`,
          },
        }
      );

      alert("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      console.error("❌ Profile update error:", err);
      alert(err.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />

          <label className="mt-3 cursor-pointer text-sm text-indigo-600 hover:underline">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <button
              onClick={handleUploadAvatar}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>

        {/* Profile Edit Form */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300"
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">
            New Password{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300"
          />

          <button
            onClick={handleProfileUpdate}
            disabled={saving}
            className="mt-6 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
