import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 py-8 bg-white text-gray-900">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
