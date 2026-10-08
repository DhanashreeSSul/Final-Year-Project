import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Briefcase,
  GraduationCap,
  MessageSquare,
  User,
  Building2,
  Users,
  PlusCircle,
  Sparkles
} from 'lucide-react';

export default function BottomNavigation() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isFoundation = user.role === 'org' || user.role === 'foundation';

  const isCurrentActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItemsWoman = [
    { to: '/woman/dashboard', label: 'Home', icon: Compass, isCenter: false },
    { to: '/woman/jobs', label: 'Jobs', icon: Briefcase, isCenter: false },
    { to: '/woman/chat', label: 'AI Guide', icon: Sparkles, isCenter: true, hasBadge: true },
    { to: '/woman/courses', label: 'Learn', icon: GraduationCap, isCenter: false },
    { to: '/woman/profile', label: 'Profile', icon: User, isCenter: false }
  ];

  const navItemsFoundation = [
    { to: '/foundation/dashboard', label: 'Home', icon: Building2, isCenter: false },
    { to: '/foundation/jobs', label: 'Jobs', icon: Briefcase, isCenter: false },
    { to: '/foundation/post-job', label: 'Post Job', icon: PlusCircle, isCenter: true },
    { to: '/foundation/applicants', label: 'Candidates', icon: Users, isCenter: false, hasBadge: true },
    { to: '/foundation/profile', label: 'Profile', icon: User, isCenter: false }
  ];

  const activeItems = isFoundation ? navItemsFoundation : navItemsWoman;

  return (
    <nav className="bottom-nav-floating" aria-label="Mobile Navigation">
      {activeItems.map((item) => {
        const active = isCurrentActive(item.to);
        const IconComponent = item.icon;

        if (item.isCenter) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              <motion.div
                className="bottom-nav-center-orb"
                whileTap={{ scale: 0.92 }}
                animate={active ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <IconComponent size={24} color="#ffffff" strokeWidth={active ? 2.5 : 2} />
                {item.hasBadge && <span className="badge-dot-pulse" style={{ top: 2, right: 2 }} />}
              </motion.div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: active ? '800' : '600',
                  color: active ? 'var(--primary-700)' : 'var(--text-light)',
                  marginTop: '2px'
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={{
              textDecoration: 'none',
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <motion.div
              animate={active ? { y: -4 } : { y: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                position: 'relative',
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {/* Plum gradient glow blob behind active tab */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-active-glow"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  style={{
                    position: 'absolute',
                    inset: '-2px -8px',
                    background: 'radial-gradient(circle, rgba(107, 45, 139, 0.18) 0%, rgba(107, 45, 139, 0) 75%)',
                    borderRadius: '20px',
                    zIndex: 0
                  }}
                />
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                <IconComponent
                  size={20}
                  color={active ? 'var(--primary-700)' : 'var(--text-light)'}
                  fill={active ? 'rgba(107, 45, 139, 0.2)' : 'none'}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                {item.hasBadge && <span className="badge-dot-pulse" />}
              </div>

              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '11px',
                  fontWeight: active ? '800' : '600',
                  color: active ? 'var(--primary-800)' : 'var(--text-light)',
                  transition: 'color 0.15s ease'
                }}
              >
                {item.label}
              </span>
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
}
