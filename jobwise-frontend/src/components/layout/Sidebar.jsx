import { Link, useLocation } from "react-router-dom";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { useAuth } from "@context/AuthContext";
import {
  LayoutDashboard,
  User,
  Bookmark,
  Briefcase,
  MessageSquare,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItemsMain = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
    { to: "/applications", label: "Applications", icon: Briefcase },
  ];

  const navItemsAI = [
    { to: "/jobwiser", label: "Jobwiser AI Advisor", icon: MessageSquare },
  ];

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.to}
        to={item.to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          location.pathname === item.to
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="w-4 h-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <nav className="flex-1 p-4 space-y-4">
        {/* Main Navigation */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Main
          </p>
          <div className="space-y-1">{navItemsMain.map(renderNavItem)}</div>
        </div>

        {/* AI Advisor */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            AI Tools
          </p>
          <div className="space-y-1">{navItemsAI.map(renderNavItem)}</div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="destructive"
          className="w-full flex items-center gap-2"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
