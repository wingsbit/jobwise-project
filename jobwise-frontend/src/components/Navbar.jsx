import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_AVATAR } from "../constants";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("online"); // "online" | "idle" | "offline"
  const menuRef = useRef(null);
  let idleTimer = useRef(null);

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : DEFAULT_AVATAR;

  // Detect activity
  useEffect(() => {
    if (!user) {
      setStatus("offline");
      return;
    }

    const handleActivity = () => {
      setStatus("online");
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setStatus("idle");
      }, 30000);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    handleActivity();
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearTimeout(idleTimer.current);
    };
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setStatus("offline");
    setMenuOpen(false);
    navigate("/");
  };

  const statusColor =
    status === "online"
      ? "bg-green-500"
      : status === "idle"
      ? "bg-yellow-400"
      : "bg-gray-400";

  return (
    <nav className="backdrop-blur-md bg-white/70 border-b border-gray-200 px-4 py-3 shadow-sm flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
        Jobwise
      </Link>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500 shadow-sm text-sm"
        />
      </div>

      {/* Links / Avatar */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-full hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative" ref={menuRef}>
            {/* Avatar + Username */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 group relative"
            >
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-gray-300 object-cover group-hover:border-indigo-500 transition"
                />
                {/* Status dot */}
                <span
                  className={`absolute bottom-0 right-0 block w-2.5 h-2.5 ${statusColor} border-2 border-white rounded-full`}
                ></span>
              </div>
              <span className="hidden sm:block text-gray-700 font-medium group-hover:text-indigo-600 transition">
                {user.name}
              </span>
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 transform transition-all duration-200 origin-top-right ${
                menuOpen
                  ? "scale-100 opacity-100 translate-y-0"
                  : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>

              {/* Menu links */}
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile
              </Link>
              <Link
                to="/saved-jobs"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Saved Jobs
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
