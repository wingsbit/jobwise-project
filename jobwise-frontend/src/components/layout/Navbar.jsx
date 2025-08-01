import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { DEFAULT_AVATAR } from "@/constants";
import { useState, useRef, useEffect } from "react";
import { Button } from "@components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : DEFAULT_AVATAR;

  // Close dropdown when clicking outside
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
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="backdrop-blur-md bg-white/70 border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition"
      >
        Jobwise
      </Link>

      {/* Auth Section */}
      {!user ? (
        <div className="space-x-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-500 hover:opacity-90 transition" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      ) : (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center space-x-2 group"
          >
            <Avatar className="border border-gray-200 group-hover:border-indigo-500 transition">
              <AvatarImage src={avatarUrl} alt="User avatar" />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:block font-medium text-gray-700 group-hover:text-indigo-600 transition">
              {user.name}
            </span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border overflow-hidden animate-in fade-in-80">
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-50 transition"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-50 transition"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/saved-jobs"
                className="block px-4 py-2 hover:bg-gray-50 transition"
                onClick={() => setMenuOpen(false)}
              >
                Saved Jobs
              </Link>
              <Button
                variant="destructive"
                className="w-full rounded-none"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
