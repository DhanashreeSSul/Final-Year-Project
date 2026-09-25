import React from 'react';
import { DEMO_ROADMAP_STEPS } from '../utils/demoData';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  Briefcase,
  BookOpen,
  DollarSign
} from 'lucide-react';

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

      {/* Progress Card */}
      <div className="card" style={{ marginBottom: '32px', backgroundColor: 'var(--primary-50)', border: '1.5px solid var(--primary-200)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--primary-900)' }}>Overall Roadmap Progress</span>
            <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary-800)' }}>{progressPercent}% Achieved</span>
          </div>
          <div className="progress-container" style={{ height: '12px' }}>
            <div className="progress-bar progress-bar-success" style={{ width: `${progressPercent}%` }} />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Step 2 of 5 currently in progress. Complete the sewing module to unlock premium job links.
          </div>
        </div>
      </div>

      {/* Visual Roadmap Timeline */}
      <div className="card">
        <div className="card-body" style={{ padding: '32px 24px' }}>
          <div className="roadmap-timeline">
            {DEMO_ROADMAP_STEPS.map((step) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <div key={step.stepNumber} className="roadmap-step-item" style={{ marginBottom: '28px' }}>
                  <div className={`roadmap-marker ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                    {isCompleted ? <CheckCircle2 size={18} /> : <span>{step.stepNumber}</span>}
                  </div>

                  <div style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--primary-50)' : '#ffffff',
                    border: isActive ? '2px solid var(--primary-400)' : '1px solid var(--border)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-main)' }}>
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
                        <span style={{ color: 'var(--secondary-700)', fontWeight: '700', fontSize: '13px' }}>
                          ✓ Completed & Verified
                        </span>
                      )}
                      {!isActive && !isCompleted && (
                        <span style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                          Unlocks after Step 2
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
