// src/components/layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  // Public routes where footer should be visible (even if logged in)
  const publicRoutes = [
    "/",
    "/home",
    "/jobs",
    "/jobs/",
    "/jobs/:id",
    "/login",
    "/signup"
  ];

  // Check if current route starts with any of the public routes
  const isPublicPage = publicRoutes.some((route) =>
    location.pathname.startsWith(route.replace(/\/$/, ""))
  );

  // Show footer if:
  // - User is not logged in (guest)
  // - OR user is logged in but currently on a public page
  const showFooter = !user || isPublicPage;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer - Only show based on rules */}
      {showFooter && <Footer />}
    </div>
  );
}
