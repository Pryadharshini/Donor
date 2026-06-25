import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaHeartbeat } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-full ring-2 ring-red-600/50" />
              <div>
                <p className="font-bold text-white text-sm">NANBARGAL</p>
                <p className="text-xs text-gray-400">Blood Foundation</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">உங்கள் ஒரு துளி — பல உயிர்களின் ஒளி<br/><span className="text-gray-500">Your drop of blood is the light of many lives.</span></p>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[{ to: '/find-donor', label: 'Find Blood Donor' }, { to: '/register-donor', label: 'Become a Donor' }, { to: '/blood-request', label: 'Request Blood' }, { to: '/login', label: 'Donor Login' }].map(l => (
                <li key={l.to}><Link to={l.to} className="text-sm text-gray-400 hover:text-red-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Blood Groups */}
          <div>
            <h4 className="text-white font-semibold mb-4">Blood Groups</h4>
            <div className="grid grid-cols-4 gap-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                <div key={g} className="flex items-center justify-center h-9 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold border border-red-600/30 hover:bg-red-600/30 transition-colors cursor-pointer">{g}</div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <FiMapPin size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span>123 Blood Donation Street,<br />Chennai, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <FiPhone size={16} className="text-red-400 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <FiMail size={16} className="text-red-400 flex-shrink-0" />
                help@nanbargal.org
              </li>
            </ul>
            <div className="mt-5 p-3 bg-red-900/20 border border-red-600/30 rounded-xl">
              <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                <FaHeartbeat /> Emergency Helpline
              </p>
              <p className="text-white font-bold text-lg mt-1">1800-BLOOD-HELP</p>
              <p className="text-xs text-gray-500">Available 24/7 Free</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">© 2025 Nanbargal Blood Foundation. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            Made with <FaHeartbeat className="text-red-500 mx-1" /> for humanity
          </div>
        </div>
      </div>
    </footer>
  );
}
