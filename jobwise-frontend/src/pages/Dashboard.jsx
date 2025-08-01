import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { DEFAULT_AVATAR } from "../constants";

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.avatar
      ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
      : DEFAULT_AVATAR
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
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUploadAvatar = async () => {
    if (!file) return alert("Please select a file first");
    const formData = new FormData();
    formData.append("avatar", file);
    const uploadToken = localStorage.getItem("token");

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

      setUser((prev) => ({ ...prev, avatar: data.user.avatar }));
      setPreview(`${import.meta.env.VITE_API_URL}/uploads/${data.user.avatar}`);
      alert("Profile picture updated!");
      setFile(null);
    } catch (err) {
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
      alert(err.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r shadow-sm p-6 flex flex-col items-center">
        <div className="relative">
          <img
            src={preview}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
          <span className="absolute bottom-2 right-2 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>

        <label className="mt-4 cursor-pointer text-sm text-indigo-600 hover:underline">
          Change Photo
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {file && (
          <button
            onClick={handleUploadAvatar}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-full hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        )}

        <hr className="my-6 w-full border-gray-200" />

        <button
          onClick={() => alert("Saved Jobs Coming Soon")}
          className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Saved Jobs
        </button>
        <button
          onClick={() => alert("Applications Coming Soon")}
          className="px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          My Applications
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

          {/* Name */}
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500"
          />

          {/* Email */}
          <label className="block mt-4 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500"
          />

          {/* Password */}
          <label className="block mt-4 text-sm font-medium text-gray-700">
            New Password <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500"
          />

          {/* Save Button */}
          <button
            onClick={handleProfileUpdate}
            disabled={saving}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
