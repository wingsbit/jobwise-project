import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/layout/Modal";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Find Your Dream Job with{" "}
          <span className="text-blue-600">Jobwise</span>
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          AI-powered career matching tailored for Georgia 🇬🇪.  
          Discover opportunities that fit your skills, interests, and goals.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => setModalOpen(true)}>
            Start with Jobwiser AI
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/jobs")}
          >
            Browse Jobs
          </Button>
        </div>
      </div>

      {/* Jobwiser AI Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-2">Hello from Jobwiser 👋</h3>
        <p className="text-gray-700">
          Our AI advisor will guide you to your ideal career path.
          (Real chat coming soon!)
        </p>
      </Modal>
    </section>
  );
}
