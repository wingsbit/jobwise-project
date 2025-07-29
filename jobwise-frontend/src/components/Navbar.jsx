// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b px-4 py-3 shadow-sm flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        Jobwise
      </Link>
      <div className="space-x-4">
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
