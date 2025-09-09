import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : DEFAULT_AVATAR;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isJobSeeker = ["jobseeker", "seeker"].includes(user?.role);
  const isRecruiter = user?.role === "recruiter";
  const isPremium = user?.isPremium;

  const navLinks = [
    { to: "/jobs", label: "Jobs" },
    { to: "/pricing", label: "Pricing" },
    { to: "/advisor", label: "AI Advisor" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto px-4 py-3">
        {/* glassy wrapper */}
        <div className="glass rounded-2xl border border-white/40 dark:border-white/10 shadow-inner-faint">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold">
              <span className="accent-grad">Jobwise</span>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative pb-1 hover:text-blue-600 ${
                      isActive ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">
              {!user ? (
                <>
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                </>
              ) : (
                <>
                  {!isPremium && (
                    <Button
                      variant="default"
                      onClick={() => navigate("/pricing")}
                      className="premium-upgrade-btn flex items-center gap-2"
                    >
                      <span>⭐</span> Upgrade
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border cursor-pointer"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 bg-white/95 backdrop-blur-md shadow-lg rounded-lg border border-gray-100 overflow-hidden animate-dropdown-fade"
                    >
                      {isJobSeeker && (
                        <>
                          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/saved-jobs")}>
                            Saved Jobs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/applications")}>
                            My Applications
                          </DropdownMenuItem>
                        </>
                      )}
                      {isRecruiter && (
                        <>
                          <DropdownMenuItem onClick={() => navigate("/my-jobs")}>
                            My Jobs
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/jobs/new")}>
                            Post a Job
                          </DropdownMenuItem>
                        </>
                      )}
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
                </>
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
                    {navLinks.map((link) => (
                      <Link key={link.to} to={link.to}>
                        {link.label}
                      </Link>
                    ))}
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
                        {!isPremium && (
                          <Button
                            variant="default"
                            onClick={() => navigate("/pricing")}
                            className="premium-upgrade-btn flex items-center gap-2"
                          >
                            <span>⭐</span> Upgrade
                          </Button>
                        )}
                        {isJobSeeker && (
                          <>
                            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                              Dashboard
                            </Button>
                            <Button variant="ghost" onClick={() => navigate("/saved-jobs")}>
                              Saved Jobs
                            </Button>
                            <Button variant="ghost" onClick={() => navigate("/applications")}>
                              My Applications
                            </Button>
                          </>
                        )}
                        {isRecruiter && (
                          <>
                            <Button variant="ghost" onClick={() => navigate("/my-jobs")}>
                              My Jobs
                            </Button>
                            <Button variant="ghost" onClick={() => navigate("/jobs/new")}>
                              Post a Job
                            </Button>
                          </>
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
        </div>
      </div>

      {/* Custom Animations (kept) */}
      <style>{`
        /* Premium Glow */
        @keyframes premiumGlow {
          0%, 100% {
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.2);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.9), 0 0 30px rgba(255, 223, 0, 0.6);
            transform: scale(1.03);
          }
        }
        .premium-upgrade-btn {
          background: linear-gradient(90deg, #FFD700, #FFC000);
          color: #fff;
          font-weight: 600;
          animation: premiumGlow 3.5s infinite ease-in-out;
          border: none;
        }
        .premium-upgrade-btn:hover {
          background: linear-gradient(90deg, #FFEA70, #FFD700);
        }

        /* Dropdown fade in */
        @keyframes dropdownFade {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown-fade { animation: dropdownFade 0.2s ease-out; }
      `}</style>
    </header>
  );
}

