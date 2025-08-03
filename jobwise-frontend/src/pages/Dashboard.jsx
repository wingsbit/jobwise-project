import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, FileText, Save, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "View Applications",
      icon: FileText,
      path: "/applications",
      color: "text-blue-500",
    },
    {
      title: "Saved Jobs",
      icon: Save,
      path: "/saved-jobs",
      color: "text-green-500",
    },
    {
      title: "AI Career Advisor",
      icon: Bot,
      path: "/ai-advisor",
      color: "text-purple-500",
    },
    {
      title: "Search Jobs",
      icon: Briefcase,
      path: "/dashboard", // Replace later with job search page
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name || "User"} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here’s your career overview and quick actions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(link.path)}
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <link.icon className={`w-6 h-6 ${link.color}`} />
              <CardTitle className="text-lg">{link.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Stats Overview (placeholder for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Applications Sent</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">12</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">3</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offers Received</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">1</CardContent>
        </Card>
      </div>
    </div>
  );
}
