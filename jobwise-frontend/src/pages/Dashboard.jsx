import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          🎉 Welcome to the Dashboard!
        </h1>
        <p className="text-gray-700">
          You’re successfully logged in. This is a protected route and only accessible to authenticated users.
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">What's Next?</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>View your profile or update your info</li>
            <li>Apply to jobs or post openings</li>
            <li>Check saved jobs or applicants</li>
            <li>Explore premium features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
