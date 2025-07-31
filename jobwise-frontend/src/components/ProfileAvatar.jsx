import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ProfileAvatar() {
  const { user, setUser, token } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    user?.avatar
      ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
      : "/default-avatar.png"
  );
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // preview before upload
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // Update context so Navbar updates instantly
      setUser({ ...user, avatar: res.data.avatar });
      alert("Profile picture updated!");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white shadow rounded-lg w-full max-w-xs">
      <img
        src={preview || "/default-avatar.png"}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
