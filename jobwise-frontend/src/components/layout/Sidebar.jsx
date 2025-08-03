import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Saved Jobs", path: "/saved-jobs" },
    { label: "Applications", path: "/applications" },
    { label: "AI Advisor", path: "/ai-advisor" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-4 text-2xl font-bold text-primary">Jobwise</div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-4 py-3 m-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
