import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Welcome message */}
      <h1 className="text-3xl font-bold mb-4">
        Welcome{user?.name ? `, ${user.name}` : ""} 🎉
      </h1>

      {/* Basic user info */}
      {user && (
        <div className="bg-white shadow rounded-lg p-4 border mb-6">
          <p className="mb-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      {/* Future dashboard sections */}
      <div className="bg-gray-100 p-4 rounded-lg border">
        <p className="text-gray-600">
          🚀 This is your dashboard. Soon you’ll see:
        </p>
        <ul className="list-disc ml-6 mt-2 text-gray-600">
          <li>Saved jobs</li>
          <li>Job applications</li>
          <li>AI career suggestions</li>
        </ul>
      </div>
    </div>
  );
}
