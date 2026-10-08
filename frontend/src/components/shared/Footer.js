import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  ShieldCheck,
  Globe,
  Lock,
  ChevronDown,
  Award,
  CheckCircle2,
  FileCheck2,
  Layers
} from 'lucide-react';

export default function Footer() {
  const { setShowLanguageModal, currentLangObj } = useLanguage();
  const [openAccordions, setOpenAccordions] = useState({
    platform: false,
    portals: false,
    access: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #1D0F2E 0%, #10071B 100%)',
        color: '#FDF8F5',
        borderTop: '1px solid rgba(107, 45, 139, 0.35)',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient plum radial glow at the top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '240px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(107, 45, 139, 0.35) 0%, rgba(107, 45, 139, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '56px 20px 28px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Main Grid Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '36px',
            marginBottom: '44px'
          }}
        >
          {/* Brand Info & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(107, 45, 139, 0.4)'
                }}
              >
                <Sparkles size={20} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em'
                }}
              >
                SHAKTI PLATFORM
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#BCAECA', lineHeight: '1.65', marginBottom: '20px' }}>
              Secured AI-Enabled Platform for Digital Literacy and Career Empowerment for Rural Women in India. Designed with human-centered AI for inclusive digital prosperity.
            </p>

            {/* Outlined Trust Seals with Shimmer Effect */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="trust-seal">
                <ShieldCheck size={16} color="var(--teal-400)" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>
                    UIDAI Verhoeff Checksum
                  </div>
                  <div style={{ fontSize: '10px', color: '#A594B7' }}>
                    Client-side validation & zero raw storage
                  </div>
                </div>
              </div>

              <div className="trust-seal">
                <Lock size={16} color="var(--secondary-400)" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>
                    AES-256 GCM Encryption
                  </div>
                  <div style={{ fontSize: '10px', color: '#A594B7' }}>
                    End-to-end data safety & PBKDF2 hashing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Column (Accordion on mobile) */}
          <div>
            <div
              onClick={() => toggleAccordion('platform')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                Platform Architecture
              </h4>
              <span className="mobile-only" style={{ color: '#BCAECA' }}>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordions.platform ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                />
              </span>
            </div>

            <div
              style={{
                display: openAccordions.platform ? 'flex' : undefined
              }}
              className="footer-accordion-content"
            >
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '14px',
                  width: '100%'
                }}
              >
                <li>
                  <Link to="/opportunities" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    Explore Opportunities
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/about" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    About Academic Project
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    Privacy & Security Specs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* User Portals Column (Accordion on mobile) */}
          <div>
            <div
              onClick={() => toggleAccordion('portals')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                User Portals
              </h4>
              <span className="mobile-only" style={{ color: '#BCAECA' }}>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordions.portals ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                />
              </span>
            </div>

            <div
              style={{
                display: openAccordions.portals ? 'flex' : undefined
              }}
              className="footer-accordion-content"
            >
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '14px',
                  width: '100%'
                }}
              >
                <li>
                  <Link to="/register" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    Register as Rural Woman
                  </Link>
                </li>
                <li>
                  <Link to="/register" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    Register as Foundation / NGO
                  </Link>
                </li>
                <li>
                  <Link to="/login" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    Dual-Mode Login (OTP / PIN)
                  </Link>
                </li>
                <li>
                  <Link to="/opportunities" style={{ color: '#C8BBD4', transition: 'color 0.15s' }}>
                    4,710+ Verified Govt Schemes
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Accessibility & Language */}
          <div>
            <div
              onClick={() => toggleAccordion('access')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                Accessibility & Language
              </h4>
              <span className="mobile-only" style={{ color: '#BCAECA' }}>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordions.access ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }}
                />
              </span>
            </div>

            <div
              style={{
                display: openAccordions.access ? 'flex' : undefined
              }}
              className="footer-accordion-content"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <p style={{ fontSize: '13px', color: '#BCAECA', lineHeight: '1.5' }}>
                  WCAG AA compliant interface optimized for low digital literacy and weak rural 2G/3G connectivity.
                </p>

                <button
                  type="button"
                  className="btn btn-outline btn-sm btn-block"
                  onClick={() => setShowLanguageModal(true)}
                  style={{
                    justifyContent: 'flex-start',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <Globe size={15} color="var(--primary-300)" />
                  <span>
                    Language: <strong style={{ color: 'var(--secondary-400)' }}>{currentLangObj.native} ({currentLangObj.name})</strong>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Academic Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '22px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '14px',
            fontSize: '12px',
            color: '#A594B7'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={15} color="var(--secondary-400)" />
            <span>
              Final Year Academic Engineering Project • <strong style={{ color: '#FDF8F5' }}>Dhanashree S. Sul & Team</strong>
            </span>
          </div>

          <div>
            <span>Empowering rural women through secure, explainable AI technology.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
