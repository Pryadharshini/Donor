import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { FaHeartbeat, FaTint } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/find-donor', label: 'Find Donor' },
  { path: '/blood-request', label: 'Blood Request' },
  { path: '/register-donor', label: 'Become a Donor' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { darkMode, setDarkMode, user, logout } = useApp();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-gray-900'} border-b border-gray-100 dark:border-gray-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.jpeg" alt="Nanbargal Blood Foundation" className="w-10 h-10 rounded-full object-cover ring-2 ring-red-100" />
            <div className="hidden sm:block">
              <p className="font-bold text-red-600 text-sm leading-tight">NANBARGAL</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Blood Foundation</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${location.pathname === link.path ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors">
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium">
                  <FiUser size={16} />
                  <span className="hidden sm:block">{user.name}</span>
                  <FiChevronDown size={14} className={`transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-12 w-48 card shadow-xl py-1 z-50">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <FaHeartbeat size={14} /> My Dashboard
                    </Link>
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <FaTint size={14} /> Admin Panel
                    </Link>
                    <hr className="my-1 border-gray-100 dark:border-gray-700" />
                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Login</Link>
                <Link to="/register-donor" className="btn-primary !py-2 !px-4 text-sm">Donate Now</Link>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-3 space-y-1 animate-fade-in">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Login</Link>
                <div className="px-4 pt-1">
                  <Link to="/register-donor" className="btn-primary block text-center text-sm">Donate Now</Link>
                </div>
              </>
            )}
            {user && (
              <>
                <Link to="/dashboard" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Dashboard</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
