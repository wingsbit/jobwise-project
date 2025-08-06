import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bookmark, Bot, FileText, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import FeaturedJobs from "@/components/ui/FeaturedJobs";
import { DEFAULT_AVATAR } from "@/constants";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [missingSkills, setMissingSkills] = useState(false);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs/recommended");
      setMissingSkills(res.data.missingSkills || false);
      setRecommendedJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Listen for profile updates → refresh recommendations instantly
    const handleSkillsUpdated = () => {
      fetchJobs();
    };
    document.addEventListener("skillsUpdated", handleSkillsUpdated);

    return () => {
      document.removeEventListener("skillsUpdated", handleSkillsUpdated);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading dashboard...
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
    : DEFAULT_AVATAR;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="p-6 flex flex-col md:flex-row md:items-center gap-6 bg-gradient-to-r from-blue-50 to-white border-blue-100">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-20 h-20 rounded-full border shadow-sm"
        />
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Your personalized AI-powered career dashboard is ready. Let’s find your next big opportunity.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </Card>

      {/* AI Advisor Teaser */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-white border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Bot className="w-6 h-6 text-purple-600" />
            Meet Jobwiser AI Career Advisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Discover your perfect career path with the power of AI. Our advisor analyzes your skills, goals, and interests to recommend jobs tailored just for you.
          </p>
          <button
            onClick={() => navigate("/advisor")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Ask AI Now
          </button>
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recommended for You</h2>

        {missingSkills ? (
          <Card
            className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate("/profile")}
          >
            <PlusCircle className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-semibold">Add Your Skills</h3>
            <p className="text-gray-600 text-sm mt-1">
              Update your profile with your top skills to get job recommendations tailored just for you.
            </p>
          </Card>
        ) : recommendedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {recommendedJobs.slice(0, 3).map((job) => (
              <FeaturedJobs key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No recommendations yet. Update your profile to help us find the best matches for you.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}

/* 🔹 Reusable Action Card Component */
function ActionCard({ icon, title, description, onClick }) {
  return (
    <Card
      className="hover:shadow-lg transition cursor-pointer border-gray-100"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-3">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
