import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow">
      <Link to="/" className="font-bold text-lg">Jobwise</Link>
      <div className="space-x-4">
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/signup" className="hover:underline">Sign Up</Link>
      </div>
    </nav>
  );
}
