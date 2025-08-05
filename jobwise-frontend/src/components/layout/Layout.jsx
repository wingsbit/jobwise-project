// src/components/layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  // Define public routes where footer should show
  const publicRoutes = [
    "/",
    "/home",
    "/jobs",
    "/jobs/",
    "/jobs/:id",
    "/login",
    "/signup",
  ];

  // Determine if current path matches a public route
  const isPublicPage = publicRoutes.some((route) =>
    location.pathname.startsWith(route.replace(/\/$/, ""))
  );

  // Show footer if:
  // - Guest (not logged in)
  // - Logged in but viewing a public page
  const showFooter = !user || isPublicPage;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar - always visible */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Conditional footer */}
      {showFooter && <Footer />}
    </div>
  );
}
