import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b flex items-center px-4 bg-card shadow-sm">
      <h1 className="font-semibold text-lg flex-1">
        Welcome{user ? `, ${user.name}` : ""}
      </h1>
      {/* Future: Add search, dark mode toggle, notifications here */}
    </header>
  );
}
