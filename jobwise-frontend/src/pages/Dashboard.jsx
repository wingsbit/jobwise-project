import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bookmark, Bot, FileText, PlusCircle, Users } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

      {/* Quick Actions */}
      {user && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Actions for Seekers */}
          {user.role === "seeker" && (
            <>
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
            </>
          )}

          {/* Actions for Recruiters */}
          {user.role === "recruiter" && (
            <>
              <ActionCard
                icon={<PlusCircle className="w-6 h-6 text-blue-600" />}
                title="Post a Job"
                description="Create a new job listing."
                onClick={() => navigate("/jobs/new")}
              />
              <ActionCard
                icon={<Briefcase className="w-6 h-6 text-green-600" />}
                title="My Jobs"
                description="Manage your posted jobs."
                onClick={() => navigate("/my-jobs")}
              />
              <ActionCard
                icon={<Users className="w-6 h-6 text-purple-600" />}
                title="View Applicants"
                description="See who applied to your jobs."
                onClick={() => navigate("/applicants")}
              />
            </>
          )}
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
