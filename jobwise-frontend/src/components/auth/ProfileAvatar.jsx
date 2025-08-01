import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ProfileAvatar() {
  const { user, setUser, api } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("/default-avatar.png");
  const [loading, setLoading] = useState(false);

  // ✅ Load current avatar from user
  useEffect(() => {
    if (user?.avatar) {
      setPreview(`${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`);
    } else {
      setPreview("/default-avatar.png");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // temporary preview
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image first");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);
      const { data } = await api.post("/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUser(data.user); // update global user
      setFile(null);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white shadow rounded-lg w-full max-w-xs">
      <img
        src={preview}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border"
      />

      <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />

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
