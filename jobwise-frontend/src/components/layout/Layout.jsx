// src/components/layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  const publicRoutes = ["/", "/home", "/jobs", "/jobs/", "/jobs/:id", "/login", "/signup"];
  const isPublicPage = publicRoutes.some((route) =>
    location.pathname.startsWith(route.replace(/\/$/, ""))
  );
  const showFooter = !user || isPublicPage;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip text-foreground">
      {/* ===== Static Background (no motion) ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Base wash */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(255,255,255,.78))] dark:bg-[linear-gradient(180deg,rgb(9,9,11),rgba(9,9,11,.86))]" />

        {/* Static aurora color wash */}
        <div className="absolute inset-0 aurora-static" />

        {/* Soft depth blobs (static) */}
        <div className="absolute -top-24 -left-24 h-[55vw] w-[55vw] rounded-full blur-3xl"
             style={{ background: "radial-gradient(closest-side, rgba(236,72,153,.12), rgba(236,72,153,0))" }} />
        <div className="absolute top-0 right-[-10%] h-[48vw] w-[48vw] rounded-full blur-[110px]"
             style={{ background: "radial-gradient(closest-side, rgba(59,130,246,.12), rgba(59,130,246,0))" }} />
        <div className="absolute bottom-[-10%] left-1/2 h-[44vw] w-[44vw] -translate-x-1/2 rounded-full blur-[120px]"
             style={{ background: "radial-gradient(closest-side, rgba(168,85,247,.12), rgba(168,85,247,0))" }} />

        {/* Static teal orb (no pulse/float) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="orb-static h-[28rem] w-[28rem] rounded-full" />
        </div>

        {/* Grid + static edge glow */}
        <div className="bg-grid-squares" />
        <div className="bg-grid-dots" />
        <div className="edge-glow-x" />
        <div className="edge-glow-y" />

        {/* Static grain */}
        <div className="bg-noise" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
