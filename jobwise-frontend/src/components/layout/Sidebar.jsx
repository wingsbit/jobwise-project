import { Link, useLocation } from "react-router-dom";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { useAuth } from "@context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
    { to: "/saved-jobs", label: "Saved Jobs" },
    { to: "/applications", label: "Applications" },
  ];

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.to
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button variant="destructive" className="w-full" onClick={logout}>
          Logout
        </Button>
      </div>
    </aside>
  );
}
