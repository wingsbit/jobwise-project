// src/pages/Home.jsx
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bookmark, Bot } from "lucide-react";
import FeaturedJobs from "@/components/ui/FeaturedJobs";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* HERO — transparent so Layout background shows */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Find Your Dream Job with{" "}
            <span className="accent-grad">Jobwise</span>
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            AI-powered career matching tailored for Georgia GE. Discover
            opportunities that fit your skills, interests, and goals.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/advisor")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start with Jobwiser AI
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">
            {user ? `Welcome back, ${user.name} 👋` : "Welcome to Jobwise 👋"}
          </h2>
          <p className="text-gray-600 mb-8">
            {user
              ? "Your personalized AI-powered career dashboard is ready. Choose one of the quick actions below to get started."
              : "Sign in to access your personalized AI-powered career dashboard and job recommendations."}
          </p>

          {user && (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Browse Jobs */}
              <div
                onClick={() => navigate("/jobs")}
                className="cursor-pointer p-6 border rounded-lg hover:shadow-md transition"
              >
                <Briefcase className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-1">Browse Jobs</h3>
                <p className="text-gray-600 text-sm">
                  Find and apply to the latest jobs.
                </p>
              </div>

              {/* Saved Jobs */}
              <div
                onClick={() => navigate("/saved-jobs")}
                className="cursor-pointer p-6 border rounded-lg hover:shadow-md transition"
              >
                <Bookmark className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-lg mb-1">Saved Jobs</h3>
                <p className="text-gray-600 text-sm">
                  View and manage your saved jobs.
                </p>
              </div>

              {/* AI Career Advisor */}
              <div
                onClick={() => navigate("/advisor")}
                className="cursor-pointer p-6 border rounded-lg hover:shadow-md transition"
              >
                <Bot className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-1">AI Career Advisor</h3>
                <p className="text-gray-600 text-sm">
                  Get tailored job recommendations.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI ADVISOR HIGHLIGHT */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-10 px-6 rounded-xl shadow-sm max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Meet <span className="accent-grad">Jobwiser AI</span> Career Advisor
            </h2>
            <p className="text-gray-600 max-w-xl">
              Discover your perfect career path with the power of AI. Our
              advisor analyzes your skills, goals, and interests to recommend
              jobs tailored just for you.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/advisor")}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try AI Advisor
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="max-w-6xl mx-auto px-6">
        <FeaturedJobs />
      </section>
    </div>
  );
}
