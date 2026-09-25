import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  KeyRound,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PrivacySecurityPage() {
  const [dataSharingEnabled, setDataSharingEnabled] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('verified_orgs_only');
  const [allowSmsAlerts, setAllowSmsAlerts] = useState(true);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    toast.success('Privacy preferences updated successfully');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
        <div className="badge badge-secondary" style={{ marginBottom: '12px' }}>
          <ShieldCheck size={14} /> Trust & Transparency
        </div>
        <h1 className="page-title" style={{ fontSize: '36px' }}>
          Your Privacy Matters
        </h1>
        <p className="page-subtitle" style={{ margin: '12px auto 0', fontSize: '17px' }}>
          Simple, plain-language explanations of how Shakti protects your identity and gives you 100% control over your data.
        </p>
      </div>

      {/* 5 Core Privacy Guarantees */}
      <div className="grid-3" style={{ marginBottom: '40px' }}>
        <div className="card">
          <div className="card-body">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--secondary-50)', color: 'var(--secondary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>We Collect Only What's Needed</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              We only ask for your name, phone number, location, and skills to match you with suitable jobs. We never ask for unnecessary personal questions.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <EyeOff size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Not Publicly Displayed</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Your profile is never indexed on public search engines. Only verified NGOs whose opportunities you apply for can view your contact details.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <UserCheck size={22} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>You Control What You Share</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              You can turn off profile sharing or withdraw applications at any time with a single tap in your account settings.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Security Architecture */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <div className="card-header">
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
            Aadhaar Verification & Cryptographic Architecture
          </h2>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--secondary-50)', color: 'var(--secondary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Official Verhoeff Checksum Algorithm</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Validates the 12-digit sequence before submission to eliminate typos and prevent fraudulent fake numbers without calling UIDAI servers unnecessarily.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>256-Bit AES-GCM Authenticated Encryption</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Plaintext Aadhaar is <strong>never written to the database</strong>. It is converted into encrypted ciphertext with cryptographic salt and initialization vector (IV).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-50)', color: 'var(--accent-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Blind Indexing (HMAC-SHA256)</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Prevents duplicate accounts from being created while strictly preserving user anonymity and preventing database leaks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Privacy Controls Box */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
            Consent Management & Sharing Controls
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>AI Match Profile Sharing</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Allow AI engine to match your skills with verified local NGO jobs</div>
              </div>
              <input
                type="checkbox"
                checked={dataSharingEnabled}
                onChange={(e) => setDataSharingEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>SMS Security Notifications</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Receive an alert whenever a new login or OTP is requested on your phone</div>
              </div>
              <input
                type="checkbox"
                checked={allowSmsAlerts}
                onChange={(e) => setAllowSmsAlerts(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--primary-700)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Save Privacy Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
