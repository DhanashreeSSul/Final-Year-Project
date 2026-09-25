import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  PlusCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { currentLangObj, setShowLanguageModal, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const isFoundation = user && (user.role === 'org' || user.role === 'foundation');
  const isWoman = user && user.role === 'user';

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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to={user ? (isFoundation ? '/foundation/dashboard' : '/woman/dashboard') : '/'} className="brand-logo">
          <div className="brand-icon-box">
            <Sparkles size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">SHAKTI</span>
            <span className="brand-subtitle">Empowering Rural Women</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-menu desktop-only">
          {!user && (
            <>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                {t('home')}
              </Link>
              <Link to="/opportunities" className={`nav-link ${isActive('/opportunities') ? 'active' : ''}`}>
                {t('opportunities')}
              </Link>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                About
              </Link>
              <Link to="/how-it-works" className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}>
                How It Works
              </Link>
              <Link to="/privacy" className={`nav-link ${isActive('/privacy') ? 'active' : ''}`}>
                Privacy & Security
              </Link>
            </>
          )}

          {isWoman && (
            <>
              <Link to="/woman/dashboard" className={`nav-link ${isActive('/woman/dashboard') ? 'active' : ''}`}>
                <Compass size={16} /> {t('dashboard')}
              </Link>
              <Link to="/woman/jobs" className={`nav-link ${isActive('/woman/jobs') ? 'active' : ''}`}>
                <Briefcase size={16} /> {t('jobs')}
              </Link>
              <Link to="/woman/courses" className={`nav-link ${isActive('/woman/courses') ? 'active' : ''}`}>
                <GraduationCap size={16} /> {t('courses')}
              </Link>
              <Link to="/woman/schemes" className={`nav-link ${isActive('/woman/schemes') ? 'active' : ''}`}>
                <FileText size={16} /> {t('schemes')}
              </Link>
              <Link to="/woman/chat" className={`nav-link ${isActive('/woman/chat') ? 'active' : ''}`}>
                <MessageSquare size={16} /> {t('chat')}
              </Link>
              <Link to="/woman/roadmap" className={`nav-link ${isActive('/woman/roadmap') ? 'active' : ''}`}>
                <Layers size={16} /> Roadmap
              </Link>
              <Link to="/woman/applications" className={`nav-link ${isActive('/woman/applications') ? 'active' : ''}`}>
                <CheckCircle size={16} /> {t('applications')}
              </Link>
            </>
          )}

          {isFoundation && (
            <>
              <Link to="/foundation/dashboard" className={`nav-link ${isActive('/foundation/dashboard') ? 'active' : ''}`}>
                <Building2 size={16} /> NGO Dashboard
              </Link>
              <Link to="/foundation/jobs" className={`nav-link ${isActive('/foundation/jobs') ? 'active' : ''}`}>
                <Briefcase size={16} /> Manage Jobs
              </Link>
              <Link to="/foundation/post-job" className={`nav-link ${isActive('/foundation/post-job') ? 'active' : ''}`}>
                <PlusCircle size={16} /> Post Opportunity
              </Link>
              <Link to="/foundation/applicants" className={`nav-link ${isActive('/foundation/applicants') ? 'active' : ''}`}>
                <Users size={16} /> AI Candidates
              </Link>
              <Link to="/foundation/programs" className={`nav-link ${isActive('/foundation/programs') ? 'active' : ''}`}>
                <GraduationCap size={16} /> Training Programs
              </Link>
            </>
          )}
        </nav>

        {/* Right Action Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Language Selector Button */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowLanguageModal(true)}
            style={{ padding: '6px 12px' }}
            title="Switch Language"
          >
            <Globe size={15} />
            <span style={{ fontWeight: '700' }}>{currentLangObj.native}</span>
          </button>

          {/* Quick Demo Switcher (Academic Presentation Aid) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              style={{ border: '1px dashed var(--primary-300)', color: 'var(--primary-700)', padding: '6px 10px' }}
              title="Quick Demo Role Switcher"
            >
              <ShieldCheck size={15} />
              <span className="desktop-only" style={{ fontSize: '12px' }}>Demo Role</span>
            </button>

            {showDemoMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '44px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                width: '260px',
                zIndex: 1000,
                padding: '8px'
              }}>
                <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', borderBottom: '1px solid var(--border)' }}>
                  QUICK PRESENTATION PRESETS
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-block btn-sm"
                  onClick={() => handleDemoSwitch('woman')}
                  style={{ justifyContent: 'flex-start', padding: '10px', marginTop: '4px' }}
                >
                  <User size={15} color="var(--primary-700)" />
                  <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>Savitri Devi</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rural Woman (Tailoring & SHG)</div>
                  </div>
                </button>

                <button
                  type="button"
                  className="btn btn-ghost btn-block btn-sm"
                  onClick={() => handleDemoSwitch('foundation')}
                  style={{ justifyContent: 'flex-start', padding: '10px' }}
                >
                  <Building2 size={15} color="var(--secondary-600)" />
                  <div style={{ textAlign: 'left', marginLeft: '6px' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>Mahila Vikas Foundation</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Registered NGO / Partner</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Auth State CTAs */}
          {!user ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline btn-sm desktop-only">
                {t('login')}
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                {t('register')}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to={isFoundation ? '/foundation/profile' : '/woman/profile'}
                className="btn btn-outline btn-sm"
                style={{ padding: '6px 12px' }}
              >
                <User size={15} />
                <span className="desktop-only" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name || user.phone}
                </span>
              </Link>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
                title="Logout"
                style={{ padding: '6px 10px' }}
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
            style={{ display: 'none' }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
