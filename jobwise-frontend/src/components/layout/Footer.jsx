import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8 md:grid-cols-3">
        
        {/* Brand & Tagline */}
        <div>
          <h2 className="text-xl font-bold text-blue-600">Jobwise.ge</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            AI-powered career matching tailored for Georgia 🇬🇪
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/jobs" className="hover:text-blue-600">Jobs</Link></li>
            <li><Link to="/ai-advisor" className="hover:text-blue-600">AI Advisor</Link></li>
            <li><Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t text-sm text-gray-500 py-4 px-4 sm:px-6 lg:px-8 text-center">
        © {new Date().getFullYear()} Jobwise.ge — All rights reserved.
      </div>
    </footer>
  );
}
