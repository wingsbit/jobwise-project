// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, Bookmark, Bot } from "lucide-react";
import FeaturedJobs from "@/components/ui/FeaturedJobs";

const HINTS = [
  '“Junior frontend, part-time, Tbilisi”',
  '“Remote React, €3k+, EU timezone”',
  '“Next.js, design systems, $5k+”',
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHintIndex((i) => (i + 1) % HINTS.length), 2600);
    return () => clearInterval(id);
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const query = q.trim();
    if (query) navigate(`/jobs?q=${encodeURIComponent(query)}`);
    else navigate("/jobs");
  }

  return (
    <div className="space-y-10">
      {/* HERO (transparent so animated background shows) */}
      <section className="px-6 pt-10">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-transparent">
          {/* Headline */}
          <h1 className="mx-auto max-w-[56rem] text-center text-4xl md:text-6xl font-extrabold leading-[1.12] text-gray-900">
            Tell me what you <span className="accent-grad">want</span>.
            <br className="hidden md:block" />
            I’ll find it.
          </h1>

          <p className="mt-3 text-center text-lg text-gray-700">
            Skills, salary, remote — type it in plain English.
          </p>

          {/* Big Search */}
          <form
            onSubmit={onSubmit}
            className="relative mx-auto mt-8 w-full max-w-3xl"
            role="search"
            aria-label="Job search"
          >
            <div className="ring-gradient rounded-full shadow-[0_10px_30px_rgba(99,102,241,.15)]">
              <div className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-2xl px-3 py-2 ring-1 ring-black/10">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={q ? "" : `e.g. ${HINTS[hintIndex]}`}
                  className="w-full rounded-full bg-transparent px-4 py-3 outline-none placeholder:text-gray-600 focus-visible:ring-2 focus-visible:ring-indigo-300/60"
                  aria-label="Job search input"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="search"
                  inputMode="search"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow hover:opacity-90 transition active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>
            <p className="px-4 pt-2 text-xs text-gray-500 text-center">
              Tip: <kbd className="rounded bg-black/5 px-1">Ctrl/⌘+K</kbd> focus •{" "}
              <kbd className="rounded bg-black/5 px-1">Esc</kbd> clear
            </p>
          </form>

          {/* Two buttons (unchanged behavior) */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/advisor")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:shadow hover:bg-blue-700 transition"
            >
              Start with Jobwiser AI
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-white/60 transition"
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
              <div
                onClick={() => navigate("/jobs")}
                className="cursor-pointer p-6 border rounded-lg hover:shadow-md transition"
              >
                <Briefcase className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg mb-1">Browse Jobs</h3>
                <p className="text-gray-600 text-sm">Find and apply to the latest jobs.</p>
              </div>

              <div
                onClick={() => navigate("/saved-jobs")}
                className="cursor-pointer p-6 border rounded-lg hover:shadow-md transition"
              >
                <Bookmark className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-lg mb-1">Saved Jobs</h3>
                <p className="text-gray-600 text-sm">View and manage your saved jobs.</p>
              </div>

              <div
                onClick={() => navigate("/advisor")}
                className="cursor-pointer p-6 border rounded-lg hover:shadow-md transition"
              >
                <Bot className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-1">AI Career Advisor</h3>
                <p className="text-gray-600 text-sm">Get tailored job recommendations.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ADVISOR HIGHLIGHT */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-10 px-6 rounded-xl shadow-sm max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Meet <span className="accent-grad">Jobwiser AI</span> Career Advisor
            </h2>
            <p className="text-gray-600 max-w-xl">
              Discover your perfect career path with the power of AI. Our advisor analyzes your
              skills, goals, and interests to recommend jobs tailored just for you.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/advisor")}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:shadow hover:bg-blue-700 transition"
            >
              Try AI Advisor
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-white/60 transition"
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
