import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, LogOut, User, Menu, X, Bell, Briefcase, BookOpen, Heart, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => { logout(); navigate('/'); };

  const userLinks = user?.role === 'user' ? [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/courses', label: 'Courses' },
    { to: '/schemes', label: 'Schemes' },
    { to: '/chatbot', label: 'AI Guide' },
  ] : user?.role === 'org' ? [
    { to: '/org/dashboard', label: 'Dashboard' },
    { to: '/org/jobs', label: 'My Jobs' },
    { to: '/org/courses', label: 'My Courses' },
  ] : [
    { to: '/jobs', label: 'Jobs' },
    { to: '/courses', label: 'Courses' },
    { to: '/schemes', label: 'Schemes' },
    { to: '/chatbot', label: 'AI Guide' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon"><Sparkles size={18} /></div>
          Shakti
        </Link>
        <div className="nav-links">
          {userLinks.map(link => (
            <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'active' : ''}`}>{link.label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                <User size={15} /> {user.name?.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="nav-link btn" style={{cursor:'pointer'}}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
