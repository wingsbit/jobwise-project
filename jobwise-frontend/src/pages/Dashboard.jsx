import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Bookmark,
  Bot,
  FileText
} from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // ⏳ Show loader while user info is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading dashboard...
      </div>
    );
  }

  // 🚫 Safety check — shouldn't happen because RoleProtectedRoute already handles it
  if (!user) {
    return null;
  }

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
    </div>
  );
}

/* 🔹 Reusable Action Card Component */
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
