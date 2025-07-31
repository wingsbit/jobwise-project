// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b px-4 py-3 shadow-sm flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-indigo-600">
        Jobwise
      </Link>

      {/* Links */}
      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <Link to="/login" className="text-gray-600 hover:text-black">
              Login
            </Link>
            <Link to="/signup" className="text-gray-600 hover:text-black">
              Signup
            </Link>
          </>
        )}

        {user && (
          <>
            {/* Avatar */}
            <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-black">
              <img
                src={
                  user?.avatar
                    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
                    : "/default-avatar.png"
                }
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span>
                {user?.name ? user.name : "Profile"}
              </span>
            </Link>

            <Link to="/dashboard" className="text-gray-600 hover:text-black">
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="text-red-500 hover:underline ml-2"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
