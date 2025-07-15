import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success('Logged out successfully!');
        navigate('/login'); // redirect to login
      })
      .catch((err) => {
        toast.error('Error logging out');
        console.error(err);
      });
  };

  const handleTryIt = () => {
    navigate('/login');
  };

  // 👇 If we are on `/` (login page), force login-navbar only
  if (location.pathname === '/' || location.pathname === '/login') {
    return (
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-600">
            MiniCRM
          </Link>

         {location.pathname === '/' && (
          <button
            onClick={handleTryIt}
            className="bg-lime-300 text-green-900 px-4 py-1 rounded-full shadow hover:scale-105 hover:bg-lime-400 transition cursor-pointer"
          >
            Try MiniCRM
          </button>
        )}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600">
          MiniCRM
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav when logged in */}
          {loggedIn && (
            <nav className="hidden md:flex gap-6 items-center">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/client', label: 'Clients' },
                { to: '/leads', label: 'Leads' },
                { to: '/tasks', label: 'Tasks' },
              ].map((link) => (
                <div key={link.to} className="group inline-block relative">
                  <Link
                    to={link.to}
                    className="text-gray-800 hover:text-green-600 relative z-10"
                   
                  >
                    {link.label}
                  </Link>
                  <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </div>
              ))}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                Logout
              </button>
            </nav>
          )}

          {/* Hamburger for small screen */}
          {loggedIn && (
            <button
              className="md:hidden text-3xl text-gray-800 ml-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {loggedIn && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-4 text-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-green-600">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="flex-grow space-y-4">
              <Link
                to="/dashboard"
                className="hover:text-green-600 block"
                onClick={() => setIsOpen(false)}
                
              >
                Dashboard
              </Link>
              <Link
                to="/client"
                className="hover:text-green-600 block"
                onClick={() => setIsOpen(false)}
                
              >
                Clients
              </Link>
              <Link
                to="/leads"
                className="hover:text-green-600 block"
                onClick={() => setIsOpen(false)}
                
              >
                Leads
              </Link>
              <Link
                to="/tasks"
                className="hover:text-green-600 block"
                onClick={() => setIsOpen(false)}
                
              >
                Tasks
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600 mt-6 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
