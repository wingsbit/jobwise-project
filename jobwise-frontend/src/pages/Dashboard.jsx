import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

export default function Dashboard() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    console.log("Saving profile...");
  };

  return (
    <AppShell>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={email} disabled className="bg-gray-100" />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
