import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border p-4">
      {/* User Info */}
      {user && (
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-20 h-20 mb-2">
            <AvatarImage src={avatarUrl || undefined} className="object-cover" />
            <AvatarFallback>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-grow">
        <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground transition">
          Dashboard
        </Link>
        <Link to="/profile" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground transition">
          Profile
        </Link>
        <Link to="/saved-jobs" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground transition">
          Saved Jobs
        </Link>
        <Link to="/applications" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground transition">
          Applications
        </Link>
        <Link to="/ai-advisor" className="px-3 py-2 rounded hover:bg-accent hover:text-accent-foreground transition">
          Jobwiser AI Advisor
        </Link>
      </nav>

      {/* Logout Button */}
      <Button onClick={handleLogout} variant="destructive" className="mt-6 w-full">
        Logout
      </Button>
    </aside>
  );
}
