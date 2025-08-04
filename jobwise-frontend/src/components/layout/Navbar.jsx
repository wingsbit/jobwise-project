// src/components/layout/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : DEFAULT_AVATAR;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Jobwise
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
          <Link to="/advisor" className="hover:text-blue-600">AI Advisor</Link>
        </nav>

        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/saved-jobs")}>
                    Saved Jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-jobs")}>
                    My Jobs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 w-64">
              <div className="flex flex-col gap-6">
                <Link to="/jobs" onClick={() => navigate("/jobs")}>
                  Jobs
                </Link>
                <Link to="/advisor" onClick={() => navigate("/advisor")}>
                  AI Advisor
                </Link>
                {!user ? (
                  <>
                    <Button variant="outline" onClick={() => navigate("/login")}>
                      Login
                    </Button>
                    <Button onClick={() => navigate("/signup")}>
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="font-medium">{user.name}</span>
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => navigate("/saved-jobs")}>
                      Saved Jobs
                    </Button>
                    <Button variant="ghost" onClick={() => navigate("/my-jobs")}>
                      My Jobs
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
