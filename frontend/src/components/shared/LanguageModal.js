import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { Globe, Check, Volume2, X } from 'lucide-react';

export default function LanguageModal() {
  const { currentLang, setLanguage, showLanguageModal, setShowLanguageModal } = useLanguage();
  const [speakingCode, setSpeakingCode] = useState(null);

  if (!showLanguageModal) return null;

  const speakLanguageGreeting = (e, lang) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const textToSpeak = `${lang.greeting || lang.native}, ${lang.native}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const speechCodeMap = {
          en: 'en-IN',
          hi: 'hi-IN',
          mr: 'mr-IN',
          ta: 'ta-IN',
          te: 'te-IN',
          kn: 'kn-IN',
          bn: 'bn-IN'
        };
        utterance.lang = speechCodeMap[lang.code] || 'hi-IN';
        utterance.rate = 0.88;

        setSpeakingCode(lang.code);
        utterance.onend = () => setSpeakingCode(null);
        utterance.onerror = () => setSpeakingCode(null);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis preview:', err.message);
        setSpeakingCode(null);
      }
    }
  };

  return (
    <AnimatePresence>
      <div
        className="detail-modal-backdrop"
        style={{
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setShowLanguageModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="card"
          style={{
            maxWidth: '560px',
            width: 'calc(100% - 24px)',
            margin: '12px auto',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            padding: '28px',
            position: 'relative',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: 'var(--primary-gradient)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(107, 45, 139, 0.28)'
                }}
              >
                <Globe size={24} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2'
                  }}
                >
                  Choose Your Language
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '600', marginTop: '2px' }}>
                  आपली भाषा निवडा • अपनी भाषा चुनें
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowLanguageModal(false)}
              style={{
                padding: '6px',
                borderRadius: '50%',
                color: 'var(--text-light)'
              }}
              aria-label="Close language selector"
            >
              <X size={20} />
            </button>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
            Select your preferred regional language. All voice assistance, navigation, and opportunity details will adapt automatically.
          </p>

          {/* 2-Column Grid of Language Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}
          >
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              const isSpeaking = speakingCode === lang.code;

              return (
                <motion.button
                  key={lang.code}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '16px',
                    minHeight: '88px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--primary-600)' : '1.5px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-50)' : 'var(--surface)',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(107, 45, 139, 0.22), var(--shadow-sm)'
                      : 'var(--shadow-sm)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}
                  >
                    {/* Native Script Large */}
                    <span
                      style={{
                        fontSize: '19px',
                        fontWeight: '800',
                        color: isSelected ? 'var(--primary-800)' : 'var(--text-main)',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {lang.native}
                    </span>

                    {/* Animated Check */}
                    {isSelected && (
                      <motion.div
                        layoutId="lang-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--primary-gradient)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>

                  {/* English Name & Pronunciation Preview Button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 'auto'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isSelected ? 'var(--primary-700)' : 'var(--text-light)'
                      }}
                    >
                      {lang.name}
                    </span>

                    {/* Speaker Pronunciation Preview */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => speakLanguageGreeting(e, lang)}
                      onKeyDown={(e) => e.key === 'Enter' && speakLanguageGreeting(e, lang)}
                      title={`Listen to pronunciation (${lang.native})`}
                      style={{
                        padding: '4px',
                        borderRadius: '6px',
                        color: isSpeaking ? 'var(--primary-600)' : 'var(--text-light)',
                        backgroundColor: isSpeaking ? 'var(--primary-100)' : 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease'
                      }}
                    >
                      <Volume2 size={15} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Continue / Confirm Button */}
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => setShowLanguageModal(false)}
            style={{
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: '700'
            }}
          >
            Continue / पुढे जा / जारी रखें
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
