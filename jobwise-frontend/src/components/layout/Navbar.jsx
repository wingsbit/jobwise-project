import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      {/* Page title placeholder (optional dynamic breadcrumb later) */}
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Welcome, {user?.name || "User"}
      </h1>

      {/* Avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={
              user?.avatar
                ? `${import.meta.env.VITE_API_URL}/uploads/${user.avatar}`
                : "/default-avatar.png"
            }
            alt={user?.name}
            className="object-cover"
          />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
