import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Compass, Briefcase, GraduationCap, MessageSquare, User, Building2, Users } from 'lucide-react';

export default function BottomNavigation() {
  const { user } = useAuth();

  if (!user) return null;

  const isFoundation = user.role === 'org' || user.role === 'foundation';

  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      {isFoundation ? (
        <>
          <NavLink to="/foundation/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Building2 size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/foundation/jobs" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Briefcase size={20} />
            <span>Jobs</span>
          </NavLink>
          <NavLink to="/foundation/applicants" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Applicants</span>
          </NavLink>
          <NavLink to="/foundation/programs" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <GraduationCap size={20} />
            <span>Programs</span>
          </NavLink>
          <NavLink to="/foundation/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/woman/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Compass size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/woman/jobs" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <Briefcase size={20} />
            <span>Jobs</span>
          </NavLink>
          <NavLink to="/woman/courses" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <GraduationCap size={20} />
            <span>Learn</span>
          </NavLink>
          <NavLink to="/woman/chat" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>AI Guide</span>
          </NavLink>
          <NavLink to="/woman/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </>
      )}
    </nav>
  );
}
