import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Shield, HeartHandshake, Globe, Lock } from 'lucide-react';

export default function Footer() {
  const { setShowLanguageModal, currentLangObj } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border)', marginTop: 'auto', padding: '48px 20px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-900)' }}>SHAKTI PLATFORM</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Secured AI-Enabled Platform for Digital Literacy and Career Empowerment for Rural Women in India.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--secondary-700)', backgroundColor: 'var(--secondary-50)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
              <Shield size={14} />
              <span>UIDAI Verhoeff Checksum & AES-256 GCM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/opportunities" style={{ color: 'var(--text-muted)' }}>Explore Opportunities</Link></li>
              <li><Link to="/how-it-works" style={{ color: 'var(--text-muted)' }}>How It Works</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-muted)' }}>About Academic Project</Link></li>
              <li><Link to="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy & Security Architecture</Link></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              User Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li><Link to="/register" style={{ color: 'var(--text-muted)' }}>Register as Rural Woman</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-muted)' }}>Register as Foundation / NGO</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-muted)' }}>Dual-Mode Login (OTP / PIN)</Link></li>
              <li><Link to="/opportunities" style={{ color: 'var(--text-muted)' }}>4,710+ Government Schemes</Link></li>
            </ul>
          </div>

          {/* Language & Trust */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Accessibility & Language
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Designed for low digital literacy and rural smartphones.
            </p>
            <button
              type="button"
              className="btn btn-outline btn-sm btn-block"
              onClick={() => setShowLanguageModal(true)}
              style={{ justifyContent: 'flex-start' }}
            >
              <Globe size={15} />
              <span>Language: <strong>{currentLangObj.native} ({currentLangObj.name})</strong></span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={13} />
            <span>Final Year Academic Engineering Project • Dhanashree S. Sul & Team</span>
          </div>
          <div>
            <span>Empowering rural communities through human-centered AI technology.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
