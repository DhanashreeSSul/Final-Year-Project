import React from 'react';
import { DEMO_ROADMAP_STEPS } from '../utils/demoData';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  Briefcase,
  BookOpen,
  DollarSign,
  Lock,
  Trophy,
  Star
} from 'lucide-react';

/* ─── Glowing node circle ─── */
function QuestNode({ step, isCompleted, isActive, isLast }) {
  const size = isActive ? 56 : 44;
  const bg = isCompleted
    ? 'linear-gradient(135deg, var(--teal-400), var(--teal-600))'
    : isActive
    ? 'linear-gradient(135deg, var(--primary-400), var(--accent-500))'
    : 'var(--bg-subtle)';
  const glowColor = isCompleted ? 'rgba(15,157,138,0.35)' : isActive ? 'rgba(107,45,139,0.35)' : 'transparent';

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: step.stepNumber * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 20px ${glowColor}`,
        position: 'relative', flexShrink: 0,
        color: isCompleted || isActive ? '#fff' : 'var(--text-light)',
        border: isActive ? '3px solid var(--primary-300)' : isCompleted ? 'none' : '2px solid var(--border)'
      }}
    >
      {/* Pulsing ring for active */}
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            border: '2px solid var(--primary-400)',
            pointerEvents: 'none'
          }}
        />
      )}

      {isCompleted ? (
        <CheckCircle2 size={isActive ? 26 : 22} />
      ) : isActive ? (
        <Sparkles size={24} />
      ) : isLast ? (
        <Trophy size={20} />
      ) : (
        <Lock size={18} />
      )}

      {/* Reward badge on completed */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: step.stepNumber * 0.12 + 0.3, type: 'spring' }}
          style={{
            position: 'absolute', top: -6, right: -6,
            width: '22px', height: '22px', borderRadius: '50%',
            background: 'var(--secondary-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--surface)',
            boxShadow: '0 2px 6px rgba(245,158,11,0.4)'
          }}
        >
          <Star size={10} fill="#fff" color="#fff" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function WomanRoadmapPage() {
  const completedCount = DEMO_ROADMAP_STEPS.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / DEMO_ROADMAP_STEPS.length) * 100);

  return (
    <div className="container" style={{ maxWidth: '800px', paddingBottom: '60px' }}>
      <div className="page-header">
        <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
          <TrendingUp size={14} /> Step-by-Step Empowerment
        </div>
        <h1 className="page-title">Your Career Roadmap</h1>
        <p className="page-subtitle">
          A clear, structured path from digital literacy and skill training to sustainable monthly income.
        </p>
      </div>

      {/* Progress Card with SVG Ring */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: '32px',
          background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
          border: '1.5px solid var(--primary-200)',
          overflow: 'hidden', position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute', top: -40, right: -20,
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(107,45,139,0.06)', filter: 'blur(30px)',
          pointerEvents: 'none'
        }} />
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', position: 'relative' }}>
          {/* SVG Progress Ring */}
          <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="6" opacity="0.3" />
              <motion.circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="url(#roadmap-ring)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 34) * (1 - progressPercent / 100) }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
              <defs>
                <linearGradient id="roadmap-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--teal-400)" />
                  <stop offset="100%" stopColor="var(--primary-500)" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>{progressPercent}%</span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary-900)', marginBottom: '4px' }}>
              Overall Roadmap Progress
            </div>
            <div className="progress-container" style={{ height: '10px', marginBottom: '6px' }}>
              <motion.div
                className="progress-bar progress-bar-success"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Step 2 of 5 currently in progress. Complete the sewing module to unlock premium job links.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Visual Quest Timeline */}
      <div className="card">
        <div className="card-body" style={{ padding: '32px 24px' }}>
          <div style={{ position: 'relative' }}>
            {/* Connecting vertical line */}
            <div style={{
              position: 'absolute',
              left: '22px', top: '28px',
              bottom: '28px', width: '3px',
              background: 'var(--border)',
              borderRadius: '999px'
            }}>
              {/* Gradient fill up to progress */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${progressPercent}%` }}
                transition={{ duration: 1.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  width: '100%', borderRadius: '999px',
                  background: 'linear-gradient(180deg, var(--teal-400), var(--primary-500))'
                }}
              />
            </div>

            {DEMO_ROADMAP_STEPS.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isLast = idx === DEMO_ROADMAP_STEPS.length - 1;

              return (
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.12, duration: 0.4 }}
                  style={{
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    marginBottom: isLast ? 0 : '24px',
                    position: 'relative'
                  }}
                >
                  <QuestNode step={step} isCompleted={isCompleted} isActive={isActive} isLast={isLast} />

                  <div style={{
                    flex: 1,
                    padding: '16px 20px',
                    borderRadius: '16px',
                    backgroundColor: isActive ? 'var(--primary-50)' : isCompleted ? 'var(--teal-50)' : 'var(--surface)',
                    border: isActive ? '2px solid var(--primary-300)' : isCompleted ? '1.5px solid var(--teal-200)' : '1px solid var(--border)',
                    boxShadow: isActive ? '0 4px 16px rgba(107,45,139,0.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{
                        fontSize: '17px', fontWeight: '700',
                        color: isCompleted ? 'var(--teal-700)' : 'var(--text-main)'
                      }}>
                        Step {step.stepNumber}: {step.title}
                      </h3>
                      <span className={`badge ${isCompleted ? 'badge-secondary' : isActive ? 'badge-primary' : 'badge-neutral'}`}>
                        {step.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                      {step.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> Estimated: {step.duration}
                      </span>

                      {isActive && (
                        <Link to="/woman/courses" className="btn btn-primary btn-sm">
                          <span>{step.actionText}</span>
                          <ArrowRight size={14} />
                        </Link>
                      )}
                      {isCompleted && (
                        <span style={{ color: 'var(--teal-600)', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Completed & Verified
                        </span>
                      )}
                      {!isActive && !isCompleted && (
                        <span style={{ color: 'var(--text-light)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Lock size={12} /> Unlocks after Step 2
                        </span>
                      )}
                    </div>

                    {/* Trophy sparkle on last completed node */}
                    {isLast && isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                        style={{
                          marginTop: '12px', padding: '10px 14px',
                          background: 'linear-gradient(135deg, var(--secondary-50), var(--teal-50))',
                          borderRadius: '12px', border: '1.5px solid var(--secondary-200)',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          fontSize: '14px', fontWeight: '700', color: 'var(--secondary-800)'
                        }}
                      >
                        <Trophy size={18} color="var(--secondary-600)" />
                        Lakhpati Didi Champion! 🎉
                        <Sparkles size={14} color="var(--secondary-500)" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
