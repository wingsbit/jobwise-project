import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Bookmark,
  Bot,
  FileText,
  PlusCircle,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect if not logged in OR recruiter opening /dashboard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (user.role === "recruiter") {
        navigate("/my-jobs");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading dashboard...
      </div>
    );
  }

  if (!user || user.role === "recruiter") {
    return null; // recruiter is redirected, guest handled by ProtectedRoute
  }

  // ✅ Role checking for seekers
  const isJobSeeker = ["jobseeker", "seeker"].includes(user.role);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Welcome, {user?.name || "User"} 👋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your personalized dashboard. Use the quick actions below to get started.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions for Jobseekers */}
      {isJobSeeker && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            icon={<Briefcase className="w-6 h-6 text-blue-600" />}
            title="Search Jobs"
            description="Browse and apply for open positions."
            onClick={() => navigate("/jobs")}
          />
          <ActionCard
            icon={<Bookmark className="w-6 h-6 text-green-600" />}
            title="Saved Jobs"
            description="View and manage jobs you’ve saved."
            onClick={() => navigate("/saved-jobs")}
          />
          <ActionCard
            icon={<Bot className="w-6 h-6 text-purple-600" />}
            title="AI Career Advisor"
            description="Get tailored job recommendations."
            onClick={() => navigate("/advisor")}
          />
          <ActionCard
            icon={<FileText className="w-6 h-6 text-orange-600" />}
            title="My Applications"
            description="Track your submitted applications."
            onClick={() => navigate("/applications")}
          />
        </div>
      )}
    </div>
  );
}

/* Reusable Action Card Component */
function ActionCard({ icon, title, description, onClick }) {
  return (
    <Card
      className="hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-3">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
