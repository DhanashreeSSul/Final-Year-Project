import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DEMO_USERS } from '../../utils/demoData';
import { authAPI } from '../../utils/api';
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  FileText,
  MessageSquare,
  Compass,
  User,
  Building2,
  LogOut,
  Globe,
  Layers,
  ShieldCheck,
  Menu,
  X,
  Users,
  CheckCircle,
  PlusCircle,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { currentLangObj, setShowLanguageModal, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isFoundation = user && (user.role === 'org' || user.role === 'foundation');
  const isWoman = user && user.role === 'user';
  const activeRoleKey = isFoundation ? 'foundation' : isWoman ? 'woman' : null;

  const handleDemoSwitch = async (roleKey) => {
    setShowDemoMenu(false);
    try {
      let res;
      if (roleKey === 'foundation') {
        res = await authAPI.login({ phone: '9000000001', password: 'password123' });
      } else {
        res = await authAPI.login({ aadhaar: '567890123458', password: 'password123' });
      }
      if (res.data?.token && res.data?.user) {
        login(res.data.token, res.data.user);
        toast.success(`Connected to Database: ${res.data.user.name}`);
        if (res.data.user.role === 'org') {
          navigate('/foundation/dashboard');
        } else {
          navigate('/woman/dashboard');
        }
        return;
      }
    } catch (e) {
      console.warn('Backend live auth fallback:', e.message);
    }
    const targetUser = DEMO_USERS[roleKey];
    login('demo-session-token', targetUser);
    toast.success(`Switched session to ${targetUser.name}`);
    if (targetUser.role === 'org') {
      navigate('/foundation/dashboard');
    } else {
      navigate('/woman/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const isPathActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Helper for animated desktop nav links
  const renderNavLink = (to, label, icon = null) => {
    const active = isPathActive(to);
    return (
      <div key={to} className="nav-link-wrapper">
        {active && (
          <motion.div
            layoutId="navbar-active-pill"
            className="nav-active-pill"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <Link
          to={to}
          className={`nav-link ${active ? 'active' : ''}`}
          style={{
            position: 'relative',
            zIndex: 1,
            color: active ? '#ffffff' : undefined,
            fontWeight: active ? '700' : '600',
            backgroundColor: 'transparent'
          }}
        >
          {icon}
          <span>{label}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="navbar-wrapper">
      <header
        className={`navbar navbar-floating ${isScrolled ? 'scrolled' : ''}`}
        style={{
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          height: isScrolled ? '62px' : '72px'
        }}
      >
        <div
          className="navbar-container"
          style={{
            height: '100%',
            maxWidth: '100%',
            padding: 0
          }}
        >
          {/* Brand Logo & Animated Role Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to={user ? (isFoundation ? '/foundation/dashboard' : '/woman/dashboard') : '/'}
              className="brand-logo"
            >
              <div
                className="brand-icon-box"
                style={{
                  width: isScrolled ? '38px' : '44px',
                  height: isScrolled ? '38px' : '44px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={isScrolled ? 19 : 22} />
              </div>
              <div className="brand-text">
                <span className="brand-title" style={{ fontSize: isScrolled ? '19px' : '21px' }}>
                  SHAKTI
                </span>
                <span className="brand-subtitle">Empowering Rural Women</span>
              </div>
            </Link>

            {/* Dynamic Animated Role Badges */}
            {isWoman && (
              <span className="role-badge-woman desktop-only">
                <Sparkles size={11} />
                <span>Woman Beneficiary</span>
              </span>
            )}
            {isFoundation && (
              <span className="role-badge-foundation desktop-only">
                <Building2 size={11} />
                <span>Verified Foundation</span>
              </span>
            )}
          </div>

          {/* Desktop Navigation Links with framer-motion sliding pill */}
          <nav className="nav-menu desktop-only">
            {!user && (
              <>
                {renderNavLink('/', t('home'))}
                {renderNavLink('/opportunities', t('opportunities'))}
                {renderNavLink('/about', 'About')}
                {renderNavLink('/how-it-works', 'How It Works')}
                {renderNavLink('/privacy', 'Privacy & Security')}
              </>
            )}

            {isWoman && (
              <>
                {renderNavLink('/woman/dashboard', t('dashboard'), <Compass size={16} />)}
                {renderNavLink('/woman/jobs', t('jobs'), <Briefcase size={16} />)}
                {renderNavLink('/woman/courses', t('courses'), <GraduationCap size={16} />)}
                {renderNavLink('/woman/schemes', t('schemes'), <FileText size={16} />)}
                {renderNavLink('/woman/chat', t('chat'), <MessageSquare size={16} />)}
                {renderNavLink('/woman/roadmap', 'Roadmap', <Layers size={16} />)}
                {renderNavLink('/woman/applications', t('applications'), <CheckCircle size={16} />)}
              </>
            )}

            {isFoundation && (
              <>
                {renderNavLink('/foundation/dashboard', 'NGO Dashboard', <Building2 size={16} />)}
                {renderNavLink('/foundation/jobs', 'Manage Jobs', <Briefcase size={16} />)}
                {renderNavLink('/foundation/post-job', 'Post Opportunity', <PlusCircle size={16} />)}
                {renderNavLink('/foundation/applicants', 'AI Candidates', <Users size={16} />)}
                {renderNavLink('/foundation/programs', 'Training Programs', <GraduationCap size={16} />)}
              </>
            )}
          </nav>

          {/* Right Action Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Selector Button with Native Script */}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowLanguageModal(true)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
              }}
              title="Switch Language"
            >
              <Globe size={15} />
              <span style={{ fontWeight: '700' }}>{currentLangObj.native}</span>
            </button>

            {/* Quick Demo Switcher with Spring Scale Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                style={{
                  border: '1.5px dashed var(--primary-300)',
                  color: 'var(--primary-700)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: showDemoMenu ? 'var(--primary-50)' : 'transparent'
                }}
                title="Quick Demo Role Switcher"
              >
                <ShieldCheck size={15} />
                <span className="desktop-only" style={{ fontSize: '12px', fontWeight: '700' }}>
                  Demo Role
                </span>
              </button>

              <AnimatePresence>
                {showDemoMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -8 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-xl)',
                      width: '270px',
                      zIndex: 1000,
                      padding: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 10px',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: 'var(--text-muted)',
                        borderBottom: '1px solid var(--border)',
                        letterSpacing: '0.04em'
                      }}
                    >
                      SWITCH ACTIVE DEMO ROLE
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-block btn-sm"
                      onClick={() => handleDemoSwitch('woman')}
                      style={{
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        marginTop: '4px',
                        backgroundColor: activeRoleKey === 'woman' ? 'var(--primary-50)' : 'transparent',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #E11D74 0%, #6B2D8B 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <User size={14} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                            Savitri Devi
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Rural Beneficiary (Tailoring)
                          </div>
                        </div>
                      </div>
                      {activeRoleKey === 'woman' && (
                        <Check size={16} color="var(--primary-700)" strokeWidth={2.5} />
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-block btn-sm"
                      onClick={() => handleDemoSwitch('foundation')}
                      style={{
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        marginTop: '2px',
                        backgroundColor: activeRoleKey === 'foundation' ? 'var(--secondary-50)' : 'transparent',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0F9D8A 0%, #6B2D8B 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Building2 size={14} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                            Mahila Vikas Foundation
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Registered NGO / Partner
                          </div>
                        </div>
                      </div>
                      {activeRoleKey === 'foundation' && (
                        <Check size={16} color="var(--teal-600)" strokeWidth={2.5} />
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth State CTAs */}
            {!user ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm desktop-only"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {t('register')}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to={isFoundation ? '/foundation/profile' : '/woman/profile'}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <User size={15} />
                  <span
                    className="desktop-only"
                    style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {user.name || user.phone}
                  </span>
                </Link>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                  title="Logout"
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                padding: '8px',
                borderRadius: 'var(--radius-full)'
              }}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                overflow: 'hidden',
                padding: '16px 8px 12px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {!user && (
                <>
                  <Link to="/" className={`nav-link ${isPathActive('/') ? 'active' : ''}`}>
                    {t('home')}
                  </Link>
                  <Link to="/opportunities" className={`nav-link ${isPathActive('/opportunities') ? 'active' : ''}`}>
                    {t('opportunities')}
                  </Link>
                  <Link to="/about" className={`nav-link ${isPathActive('/about') ? 'active' : ''}`}>
                    About
                  </Link>
                  <Link to="/how-it-works" className={`nav-link ${isPathActive('/how-it-works') ? 'active' : ''}`}>
                    How It Works
                  </Link>
                  <Link to="/privacy" className={`nav-link ${isPathActive('/privacy') ? 'active' : ''}`}>
                    Privacy & Security
                  </Link>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <Link to="/login" className="btn btn-outline btn-block">
                      {t('login')}
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-block">
                      {t('register')}
                    </Link>
                  </div>
                </>
              )}

              {isWoman && (
                <>
                  <Link to="/woman/dashboard" className={`nav-link ${isPathActive('/woman/dashboard') ? 'active' : ''}`}>
                    <Compass size={16} /> {t('dashboard')}
                  </Link>
                  <Link to="/woman/jobs" className={`nav-link ${isPathActive('/woman/jobs') ? 'active' : ''}`}>
                    <Briefcase size={16} /> {t('jobs')}
                  </Link>
                  <Link to="/woman/courses" className={`nav-link ${isPathActive('/woman/courses') ? 'active' : ''}`}>
                    <GraduationCap size={16} /> {t('courses')}
                  </Link>
                  <Link to="/woman/schemes" className={`nav-link ${isPathActive('/woman/schemes') ? 'active' : ''}`}>
                    <FileText size={16} /> {t('schemes')}
                  </Link>
                  <Link to="/woman/chat" className={`nav-link ${isPathActive('/woman/chat') ? 'active' : ''}`}>
                    <MessageSquare size={16} /> {t('chat')}
                  </Link>
                  <Link to="/woman/roadmap" className={`nav-link ${isPathActive('/woman/roadmap') ? 'active' : ''}`}>
                    <Layers size={16} /> Roadmap
                  </Link>
                  <Link to="/woman/applications" className={`nav-link ${isPathActive('/woman/applications') ? 'active' : ''}`}>
                    <CheckCircle size={16} /> {t('applications')}
                  </Link>
                </>
              )}

              {isFoundation && (
                <>
                  <Link to="/foundation/dashboard" className={`nav-link ${isPathActive('/foundation/dashboard') ? 'active' : ''}`}>
                    <Building2 size={16} /> NGO Dashboard
                  </Link>
                  <Link to="/foundation/jobs" className={`nav-link ${isPathActive('/foundation/jobs') ? 'active' : ''}`}>
                    <Briefcase size={16} /> Manage Jobs
                  </Link>
                  <Link to="/foundation/post-job" className={`nav-link ${isPathActive('/foundation/post-job') ? 'active' : ''}`}>
                    <PlusCircle size={16} /> Post Opportunity
                  </Link>
                  <Link to="/foundation/applicants" className={`nav-link ${isPathActive('/foundation/applicants') ? 'active' : ''}`}>
                    <Users size={16} /> AI Candidates
                  </Link>
                  <Link to="/foundation/programs" className={`nav-link ${isPathActive('/foundation/programs') ? 'active' : ''}`}>
                    <GraduationCap size={16} /> Training Programs
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
