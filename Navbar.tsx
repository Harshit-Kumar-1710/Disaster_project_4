import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  // Don't show navbar on landing and auth pages
  if (location.pathname === '/' || location.pathname === '/auth') {
    return null;
  }
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-900">SafeEscape</span>
            </Link>
          </div>
          
          {currentUser && (
            <>
              <div className="hidden md:flex md:items-center md:space-x-6">
                <Link to="/dashboard" className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Dashboard
                </Link>
                <Link to="/add-location" className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/add-location' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Add Location
                </Link>
                <Link to="/check-safety" className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === '/check-safety' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Check Safety
                </Link>
                <Link to="/sos" className="btn btn-danger flex items-center space-x-1">
                  <AlertTriangle size={18} />
                  <span>SOS</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <LogOut size={18} className="mr-1" />
                  <span>Logout</span>
                </button>
              </div>
              
              <div className="flex md:hidden items-center">
                <Link to="/sos" className="mr-2 btn btn-danger flex items-center">
                  <AlertTriangle size={18} />
                  <span className="sr-only">SOS</span>
                </Link>
                
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && currentUser && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <Link 
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/add-location"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/add-location' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={toggleMenu}
            >
              Add Location
            </Link>
            <Link 
              to="/check-safety"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/check-safety' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={toggleMenu}
            >
              Check Safety
            </Link>
            <button 
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;