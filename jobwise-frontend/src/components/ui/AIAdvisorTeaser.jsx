import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AIAdvisorTeaser() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-100 rounded-xl p-8 shadow-sm">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Meet <span className="text-blue-600">Jobwiser AI</span> Career Advisor
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Discover your perfect career path with the power of AI.  
          Our advisor analyzes your skills, goals, and interests to recommend jobs tailored just for you.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/advisor")}
          >
            Try AI Advisor
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/signup")}
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </section>
  );
}
