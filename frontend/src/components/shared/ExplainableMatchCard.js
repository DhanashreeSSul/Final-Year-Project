import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, MapPin, Briefcase, IndianRupee, Info, X, ChevronRight, Star } from 'lucide-react';

/* ─── SVG circular score ring ─── */
function ScoreRing({ score, size = 56, stroke = 5 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const t = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 120);
    return () => clearTimeout(t);
  }, [score, circumference]);

  const color = score >= 85 ? 'var(--teal-500)' : score >= 60 ? 'var(--secondary-500)' : 'var(--text-light)';
  const glowColor = score >= 85 ? 'rgba(15,157,138,0.35)' : score >= 60 ? 'rgba(245,158,11,0.3)' : 'transparent';
  const gradientId = `ring-${score}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={score >= 85 ? 'var(--teal-400)' : score >= 60 ? 'var(--secondary-400)' : 'var(--text-light)'} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--border)" strokeWidth={stroke}
          opacity={0.35}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 6px ${glowColor})`
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1
      }}>
        <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>{score}%</span>
      </div>
    </div>
  );
}

/* ─── Animated bar for modal breakdown ─── */
function AnimatedBar({ label, value, color = 'var(--primary-500)', delay = 0, explanation }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.12, duration: 0.4, ease: 'easeOut' }}
      style={{ marginBottom: '4px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '800', color }}>{value}%</span>
      </div>
      <div style={{
        height: '8px', borderRadius: '999px',
        backgroundColor: 'var(--bg-subtle)',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.15 + delay * 0.12, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: '100%', borderRadius: '999px',
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 8px ${color}40`
          }}
        />
      </div>
      {explanation && (
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', lineHeight: '1.4' }}>{explanation}</p>
      )}
    </motion.div>
  );
}

/* ─── Holographic badge (Top Match) ─── */
function HoloBadge({ score }) {
  if (score < 85) return null;
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
      className="holo-badge-wrapper"
      style={{
        position: 'relative',
        padding: '2px', borderRadius: '999px',
        background: 'conic-gradient(from 0deg, #6B2D8B, #F59E0B, #0F9D8A, #E11D74, #6B2D8B)',
        backgroundSize: '400% 400%',
        animation: 'holo-spin 4s linear infinite',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        padding: '4px 10px', borderRadius: '999px',
        background: 'var(--surface)',
        fontSize: '10px', fontWeight: '800',
        color: 'var(--primary-700)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      }}>
        <Star size={10} fill="var(--secondary-500)" color="var(--secondary-500)" />
        Top Match
      </div>
    </motion.div>
  );
}

export default function ExplainableMatchCard({
  title,
  company,
  location,
  salary,
  jobType,
  workMode,
  matchScore = 92,
  breakdown = { skill_match: 95, interest_match: 90, location_match: 88, work_preference: 95 },
  reasons = [],
  onApply,
  onViewDetails,
  actionText = 'Apply Now'
}) {
  const [showAiModal, setShowAiModal] = useState(false);

  const breakdownEntries = [
    { label: 'Skill Match', key: 'skill_match', color: 'var(--primary-600)', explanation: 'Experience & craft alignment' },
    { label: 'Interest Alignment', key: 'interest_match', color: 'var(--secondary-600)', explanation: 'Career interest fit' },
    { label: 'Location Proximity', key: 'location_match', color: 'var(--teal-500)', explanation: location ? `Distance to ${location}` : 'Geographic fit' },
    { label: 'Work Mode Fit', key: 'work_preference', color: 'var(--accent-500)', explanation: jobType ? `Matches ${jobType} preference` : 'Schedule compatibility' },
  ];

  return (
    <>
      <motion.div
        className="card card-hover-lift"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
      >
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
          {/* Header with Score Ring + Holo Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 className="line-clamp-2" title={title} style={{
                fontSize: '17px', fontWeight: '700', color: 'var(--text-main)',
                marginBottom: '4px', lineHeight: '1.35'
              }}>
                {title}
              </h3>
              <p className="line-clamp-1" style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '600' }}>
                {company}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                onClick={() => setShowAiModal(true)}
                style={{ cursor: 'pointer' }}
                title="Calculated by Shakti Hybrid Recommendation Engine"
                role="button"
                tabIndex={0}
                aria-label={`${matchScore}% match score — click for breakdown`}
                onKeyDown={(e) => e.key === 'Enter' && setShowAiModal(true)}
              >
                <ScoreRing score={matchScore} />
              </div>
              <HoloBadge score={matchScore} />
            </div>
          </div>

          {/* Key Info Meta Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {location && (
              <span className="badge badge-neutral" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {location}
              </span>
            )}
            {jobType && (
              <span className="badge badge-neutral" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Briefcase size={12} /> {jobType}
              </span>
            )}
            {salary && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', fontWeight: '700',
                color: 'var(--teal-700)',
                backgroundColor: 'var(--teal-50)',
                border: '1px solid var(--teal-200)',
                padding: '4px 10px', borderRadius: '999px'
              }}>
                <IndianRupee size={12} /> {salary}
              </span>
            )}
          </div>

          {/* AI Teaser */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            style={{
              background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--secondary-50) 100%)',
              border: '1px solid var(--primary-100)',
              borderRadius: '12px',
              padding: '10px 14px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--primary-800)',
              textAlign: 'left',
              marginBottom: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} color="var(--secondary-600)" />
              Why did AI match this to your skills?
            </span>
            <span style={{ color: 'var(--primary-600)', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
              View <ChevronRight size={12} />
            </span>
          </button>

          {/* Action Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
            {onViewDetails && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onViewDetails}
                style={{ flex: 1 }}
              >
                <Info size={14} />
                <span>View Details</span>
              </button>
            )}
            {onApply && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onApply}
                style={{ flex: 1.2 }}
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* AI Compatibility Breakdown Modal */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            className="detail-modal-backdrop"
            onClick={() => setShowAiModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="detail-modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '580px' }}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              {/* Modal Header */}
              <div className="detail-modal-header">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  style={{
                    position: 'absolute',
                    right: '16px', top: '16px',
                    background: 'var(--bg-subtle)',
                    border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-muted)',
                    transition: 'background 0.2s'
                  }}
                  title="Close modal"
                >
                  <X size={18} />
                </button>

                {/* Large score ring in modal header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <ScoreRing score={matchScore} size={72} stroke={6} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Overall Compatibility
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                      {matchScore}%
                    </div>
                  </div>
                </div>

                <h2 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                  {title}
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '600', marginTop: '2px' }}>
                  {company} • {location}
                </div>
              </div>

              {/* Modal Body */}
              <div className="detail-modal-body">
                <div>
                  <div className="detail-section-title">
                    <Sparkles size={15} color="var(--primary-700)" />
                    <span>AI Matching Criteria Breakdown</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Evaluated using Shakti's multi-criteria scoring algorithm against your profile skills, location, and preferred work mode.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {breakdownEntries.map((entry, idx) => (
                      <AnimatedBar
                        key={entry.key}
                        label={entry.label}
                        value={breakdown[entry.key] || 90}
                        color={entry.color}
                        delay={idx}
                        explanation={entry.explanation}
                      />
                    ))}
                  </div>
                </div>

                {/* Reasons */}
                {reasons && reasons.length > 0 && (
                  <div>
                    <div className="detail-section-title">
                      <CheckCircle2 size={15} color="var(--secondary-600)" />
                      <span>Key Compatibility Factors</span>
                    </div>
                    <div style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '14px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {reasons.map((reason, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-body)' }}
                        >
                          <CheckCircle2 size={15} color="var(--secondary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{reason}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="detail-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAiModal(false)}
                  style={{ flex: 1 }}
                >
                  Close
                </button>
                {onViewDetails && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setShowAiModal(false);
                      onViewDetails();
                    }}
                    style={{ flex: 1 }}
                  >
                    Full Job Specs
                  </button>
                )}
                {onApply && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setShowAiModal(false);
                      onApply();
                    }}
                    style={{ flex: 1.2 }}
                  >
                    {actionText}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
