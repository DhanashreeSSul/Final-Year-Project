import React from 'react';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { Globe, Check } from 'lucide-react';

export default function LanguageModal() {
  const { currentLang, setLanguage, showLanguageModal, setShowLanguageModal } = useLanguage();

  if (!showLanguageModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Globe size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>Choose Your Language</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>आपली भाषा निवडा • अपनी भाषा चुनें</p>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '12px 0 20px' }}>
          Select your preferred language. You can change this at any time from the top bar or settings.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '14px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid var(--primary-700)' : '1.5px solid var(--border)',
                  backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '700', color: isSelected ? 'var(--primary-900)' : 'var(--text-main)' }}>
                    {lang.native}
                  </span>
                  {isSelected && <Check size={16} color="var(--primary-700)" />}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowLanguageModal(false)}
            style={{ width: '100%' }}
          >
            Continue / पुढे जा
          </button>
        </div>
      </div>
    </div>
  );
}
