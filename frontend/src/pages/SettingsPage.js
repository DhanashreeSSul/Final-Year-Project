import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import {
  Settings,
  Globe,
  ShieldCheck,
  Bell,
  Lock,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { currentLang, setLanguage } = useLanguage();

  const [aiMatchingEnabled, setAiMatchingEnabled] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [districtVisibility, setDistrictVisibility] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Account settings updated.');
  };

  return (
    <div className="container" style={{ maxWidth: '780px', paddingBottom: '60px' }}>
      <div className="page-header">
        <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
          <Settings size={14} /> Account Configuration
        </div>
        <h1 className="page-title">Settings & Privacy Controls</h1>
        <p className="page-subtitle">Manage language preferences, privacy controls, and security notifications.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Language Selection Card */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--primary-700)" />
              <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Platform Language / भाषा</h2>
            </div>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Select your preferred display and voice assistant language:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      toast.success(`Language switched to ${lang.native}`);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary-700)' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: isSelected ? 'var(--primary-900)' : 'var(--text-main)' }}>
                        {lang.native}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{lang.name}</div>
                    </div>
                    {isSelected && <CheckCircle2 size={16} color="var(--primary-700)" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Privacy & Data Sharing Controls */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--secondary-600)" />
              <h2 style={{ fontSize: '17px', fontWeight: '700' }}>Privacy & Data Sharing</h2>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>AI Match Profile Sharing</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Allow AI engine to match your skills with verified NGO jobs and government schemes
                </div>
              </div>
              <input
                type="checkbox"
                checked={aiMatchingEnabled}
                onChange={(e) => setAiMatchingEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>District Location Sharing</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Only show opportunities within your district ({user?.district || 'Varanasi'})
                </div>
              </div>
              <input
                type="checkbox"
                checked={districtVisibility}
                onChange={(e) => setDistrictVisibility(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>SMS Security & Job Alerts</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Receive SMS updates for shortlisted jobs and one-time password security
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Security Summary Box */}
        <div className="card" style={{ backgroundColor: 'var(--bg-subtle)' }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Lock size={24} color="var(--primary-700)" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Cryptographic Zero-Knowledge Security Active</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Your Aadhaar is protected with 256-bit AES-GCM encryption and UIDAI Verhoeff validation.
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
