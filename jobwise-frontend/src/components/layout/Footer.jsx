import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t shadow-sm">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid gap-6 md:grid-cols-3">
        
        {/* Brand & Tagline */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-blue-600">Jobwise.ge</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-xs mx-auto md:mx-0">
            AI-powered career matching tailored for Georgia 🇬🇪
          </p>
        </div>

        {/* Navigation */}
        <div className="text-center md:text-left">
          <h3 className="text-sm font-semibold mb-2 text-gray-800 uppercase tracking-wide">
            Navigation
          </h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/jobs" className="footer-link">Jobs</Link></li>
            <li><Link to="/advisor" className="footer-link">AI Advisor</Link></li>
            <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="text-center md:text-left">
          <h3 className="text-sm font-semibold mb-2 text-gray-800 uppercase tracking-wide">
            Legal
          </h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 py-4 px-4 sm:px-6 lg:px-8 gap-2">
        <p>© {new Date().getFullYear()} Jobwise.ge — All rights reserved.</p>
        <p className="text-gray-400">Made with ❤️ for job seekers & recruiters</p>
      </div>

      {/* Matching Navbar underline animation */}
      <style>{`
        .footer-link {
          position: relative;
          display: inline-block;
          padding-bottom: 2px;
          color: inherit;
          transition: color 0.2s ease-in-out;
        }
        .footer-link:hover {
          color: #2563eb; /* Blue-600 */
        }
        .footer-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: #2563eb;
          transition: width 0.3s ease-in-out;
        }
        .footer-link:hover::after {
          width: 100%;
        }
      `}</style>
    </footer>
  );
}
