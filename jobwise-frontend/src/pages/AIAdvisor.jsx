import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AIAdvisor() {
  const [skills, setSkills] = useState("");
  const [goals, setGoals] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

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
          <Button
            onClick={handleGetAdvice}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Getting Advice..." : "Get Advice"}
          </Button>
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
