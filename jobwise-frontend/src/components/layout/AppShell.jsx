import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import Sidebar from "@components/layout/Sidebar";
import { useAuth } from "@context/AuthContext";
import { Outlet, useLocation } from "react-router-dom";

export default function AppShell() {
  const { user } = useAuth();
  const location = useLocation();

  // Sidebar only for authenticated dashboard/profile pages
  const showSidebar =
    user &&
    (location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/profile"));

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
