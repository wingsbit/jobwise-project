import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AIAdvisor() {
  const { saveRoadmap } = useAuth();
  const [skills, setSkills] = useState("");
  const [goals, setGoals] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Generate roadmap from AI and auto-save
  const handleGetAdvice = async () => {
    if (!skills.trim() || !goals.trim()) {
      setStatus({ type: "error", message: "Please fill in both skills and goals." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // 1️⃣ Get AI-generated advice
      const res = await api.post("/api/advisor/analyze", {
        skills: skills.split(",").map((s) => s.trim()),
        goals
      });

      const generatedAdvice = res.data.advice || "No advice available at this time.";
      setAdvice(generatedAdvice);

      // 2️⃣ Save to backend via AuthContext
      await saveRoadmap(generatedAdvice);

      setStatus({ type: "success", message: "Roadmap generated and saved successfully!" });
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("");
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Jobwiser AI Career Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Message */}
          {status.message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md text-sm ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {status.message}
            </div>
          )}

          {/* Skills Input */}
          <Input
            placeholder="Your skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          {/* Goals Input */}
          <Input
            placeholder="Your career goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />

          {/* Generate Button */}
          <Button
            onClick={handleGetAdvice}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Generating Roadmap..." : "Get My Roadmap"}
          </Button>

          {/* Advice Display */}
          {advice && (
            <div className="mt-4 p-4 bg-gray-50 border rounded text-sm text-gray-700 whitespace-pre-line">
              {advice}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
