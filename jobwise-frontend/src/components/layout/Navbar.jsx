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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : DEFAULT_AVATAR;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Role checks
  const isJobSeeker = ["jobseeker", "seeker"].includes(user?.role);
  const isRecruiter = user?.role === "recruiter";

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
          {isJobSeeker && (
            <Link to="/advisor" className="hover:text-blue-600">AI Advisor</Link>
          )}
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
                  
                  {/* Dashboard route depends on role */}
                  {isJobSeeker && (
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  {isRecruiter && (
                    <DropdownMenuItem onClick={() => navigate("/my-jobs")}>
                      My Jobs
                    </DropdownMenuItem>
                  )}

                  {/* Jobseeker-only menu */}
                  {isJobSeeker && (
                    <DropdownMenuItem onClick={() => navigate("/saved-jobs")}>
                      Saved Jobs
                    </DropdownMenuItem>
                  )}

                  {/* Recruiter-only menu */}
                  {isRecruiter && (
                    <DropdownMenuItem onClick={() => navigate("/jobs/new")}>
                      Post a Job
                    </DropdownMenuItem>
                  )}

                  {/* Shared */}
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
                {isJobSeeker && (
                  <Link to="/advisor" onClick={() => navigate("/advisor")}>
                    AI Advisor
                  </Link>
                )}
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
                    {isJobSeeker && (
                      <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                        Dashboard
                      </Button>
                    )}
                    {isRecruiter && (
                      <Button variant="ghost" onClick={() => navigate("/my-jobs")}>
                        My Jobs
                      </Button>
                    )}
                    {isJobSeeker && (
                      <Button variant="ghost" onClick={() => navigate("/saved-jobs")}>
                        Saved Jobs
                      </Button>
                    )}
                    {isRecruiter && (
                      <Button variant="ghost" onClick={() => navigate("/jobs/new")}>
                        Post a Job
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => navigate("/profile")}>
                      Profile
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
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
