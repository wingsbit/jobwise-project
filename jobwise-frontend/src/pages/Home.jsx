// src/pages/Home.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Welcome back, {user?.name || "User"} 👋
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your AI-powered career dashboard is ready.  
            Select a tool from the sidebar to get started.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            Update your personal information and manage your account.
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            Review and apply to jobs you’ve saved for later.
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>AI Advisor</CardTitle>
          </CardHeader>
          <CardContent>
            Get personalized career advice powered by Jobwiser AI.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
