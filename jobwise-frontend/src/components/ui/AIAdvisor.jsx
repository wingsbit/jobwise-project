import { useState } from "react";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIAdvisor() {
  const [skills, setSkills] = useState("");
  const [goals, setGoals] = useState("");
  const [advice, setAdvice] = useState("");
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setAdvice("");
    setMatchingJobs([]);
    setLoading(true);

    try {
      const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);

      const res = await api.post("/api/advisor/analyze", {
        skills: skillList,
        goals,
      });
      setAdvice(res.data.advice);

      const jobsRes = await api.get("/api/jobs");
      const matched = jobsRes.data.filter((job) =>
        job.skills?.some((skill) =>
          skillList.some(
            (userSkill) => skill.toLowerCase() === userSkill.toLowerCase()
          )
        )
      );
      setMatchingJobs(matched);
    } catch (error) {
      setAdvice(error.response?.data?.msg || "Error getting advice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
          <Textarea
            placeholder="Your career goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            rows={4}
          />
          <Button onClick={getAdvice} className="w-full">
            {loading ? "Analyzing..." : "Get Advice"}
          </Button>

          {advice && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h3 className="font-bold mb-2">AI Advice:</h3>
              <p>{advice}</p>
            </div>
          )}

          {matchingJobs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Matching Jobs:</h3>
              <ul className="space-y-2">
                {matchingJobs.map((job) => (
                  <li key={job._id} className="border p-3 rounded shadow-sm">
                    <h4 className="font-bold">{job.title}</h4>
                    <p className="text-gray-600">{job.location}</p>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
