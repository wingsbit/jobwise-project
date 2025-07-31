import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill form with current name
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put("/auth/update", {
        name: name.trim(),
        password: password.trim() || undefined, // send only if password entered
      });

      // ✅ Update global AuthContext so Navbar/Dashboard refresh instantly
      setUser(data.user);

      // ✅ Reset password field & show success
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

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email (read only) */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded-md bg-gray-100"
            value={user.email}
            disabled
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">New Password (optional)</label>
          <input
            type="password"
            className="w-full border px-4 py-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
