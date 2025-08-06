import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ComingSoon({ title, description }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2 max-w-lg">{description}</p>
      <Button className="mt-6" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </Button>
    </div>
  );
}
