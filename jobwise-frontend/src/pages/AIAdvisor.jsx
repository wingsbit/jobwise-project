import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AIAdvisor() {
  const { user } = useAuth();
  const [skills, setSkills] = useState("");
  const [goals, setGoals] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Prefill skills if available in profile
  useEffect(() => {
    if (user?.skills?.length) {
      setSkills(user.skills.join(", "));
    }
  }, [user]);

  const handleGetAdvice = async () => {
    if (!skills.trim() || !goals.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/advisor/analyze", { skills, goals });
      setAdvice(res.data.advice || "No advice available at this time.");
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdvice = async () => {
    if (!advice) return;
    setSaving(true);
    try {
      await api.post("/api/advisor/save", { advice });
      alert("Your roadmap has been saved to your profile!");
    } catch (error) {
      console.error("Error saving advice:", error);
      alert("Failed to save roadmap. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Jobwiser AI Career Advisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Your skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <Input
            placeholder="Your career goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          />
          <Button onClick={handleGetAdvice} disabled={loading} className="w-full">
            {loading ? "Getting Advice..." : "Get Advice"}
          </Button>
          {advice && (
            <>
              <div className="mt-4 p-4 bg-gray-50 border rounded text-sm text-gray-700 whitespace-pre-line">
                {advice}
              </div>
              <Button
                onClick={handleSaveAdvice}
                disabled={saving}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? "Saving..." : "Save Roadmap"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
