import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bookmark, Bot, FileText, PlusCircle, Target } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import FeaturedJobs from "@/components/ui/FeaturedJobs";
import { DEFAULT_AVATAR } from "@/constants";

export default function Dashboard() {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [missingSkills, setMissingSkills] = useState(false);

  // 🔹 Helper to extract simple keywords from roadmap
  const extractSkillsFromRoadmap = (roadmapText) => {
    if (!roadmapText) return [];
    return roadmapText
      .split(/\s|,|\.|\n/) // split on spaces, commas, dots, and newlines
      .filter((word) => /^[a-zA-Z]+$/.test(word)) // keep words only
      .map((word) => word.toLowerCase())
      .filter((w, i, arr) => arr.indexOf(w) === i) // unique
      .slice(0, 6); // only top 6
  };

  // ✅ Fetch recommended jobs
  const fetchJobs = async () => {
    try {
      let endpoint = "/api/jobs/recommended";

      // If roadmap exists, send extracted skills in query
      if (user?.careerRoadmap) {
        const roadmapSkills = extractSkillsFromRoadmap(user.careerRoadmap);
        if (roadmapSkills.length > 0) {
          endpoint += `?skills=${encodeURIComponent(roadmapSkills.join(","))}`;
        }
      }

      const res = await api.get(endpoint);
      setMissingSkills(res.data.missingSkills || false);
      setRecommendedJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    const handleSkillsUpdated = async () => {
      await refreshUser();
      fetchJobs();
    };
    document.addEventListener("skillsUpdated", handleSkillsUpdated);
    return () => {
      document.removeEventListener("skillsUpdated", handleSkillsUpdated);
    };
  }, [user?.careerRoadmap]); // refresh if roadmap changes

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
      <Card className="p-6 flex flex-col md:flex-row md:items-center gap-6 bg-gradient-to-r from-blue-50 to-white border-blue-100 shadow-sm">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-20 h-20 rounded-full border shadow-sm object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Your personalized AI-powered career dashboard is ready.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </Card>

      {/* Career Roadmap */}
      {user?.careerRoadmap && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-white border-green-200 shadow-sm">
          <CardHeader className="flex items-center gap-2">
            <Target className="w-6 h-6 text-green-600" />
            <CardTitle>Your AI Career Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed border-l-4 border-green-300 pl-4">
              {user.careerRoadmap}
            </p>
            <button
              onClick={() => navigate("/advisor")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Update Roadmap
            </button>
          </CardContent>
        </Card>
      )}

      {/* AI Advisor Teaser */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-white border-purple-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Bot className="w-6 h-6 text-purple-600" />
            Meet Jobwiser AI Career Advisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Discover your perfect career path with the power of AI.
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
              Update your profile to get tailored job recommendations.
            </p>
          </Card>
        ) : recommendedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {recommendedJobs.slice(0, 3).map((job) => (
              <FeaturedJobs key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recommendations yet.</p>
        )}
      </div>
    </div>
  );
}
