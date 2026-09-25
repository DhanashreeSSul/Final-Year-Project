import React, { useState } from 'react';
import { Sparkles, CheckCircle2, MapPin, Briefcase, IndianRupee, Info, X, ChevronRight } from 'lucide-react';

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

  return (
    <>
      <div className="card card-hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
          {/* Header with Match Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <h3 className="line-clamp-2" title={title} style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px', lineHeight: '1.35' }}>
                {title}
              </h3>
              <p className="line-clamp-1" style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '600' }}>
                {company}
              </p>
            </div>
            <div
              className="badge badge-match"
              title="Calculated by Shakti Hybrid Recommendation Engine"
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => setShowAiModal(true)}
            >
              <Sparkles size={13} />
              <span>{matchScore}% Match</span>
            </div>
          </div>

          {/* Key Info Meta Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {location && (
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                <MapPin size={12} /> {location}
              </span>
            )}
            {jobType && (
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                <Briefcase size={12} /> {jobType}
              </span>
            )}
            {salary && (
              <span className="badge badge-accent" style={{ fontSize: '11px' }}>
                <IndianRupee size={12} /> {salary}
              </span>
            )}
          </div>

          {/* Clean AI Teaser Link (Click opens details modal instead of bloating the card) */}
          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              style={{
                background: 'var(--secondary-50)',
                border: '1px solid var(--secondary-100)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--secondary-800)',
                textAlign: 'left'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} color="var(--secondary-600)" />
                Why did AI match this to your skills?
              </span>
              <span style={{ color: 'var(--secondary-600)', fontSize: '11px', fontWeight: '700' }}>View Breakdown ➔</span>
            </button>
          </div>

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
      </div>

      {/* AI Compatibility Breakdown Modal ("After going details show it") */}
      {showAiModal && (
        <div className="detail-modal-backdrop" onClick={() => setShowAiModal(false)}>
          <div
            className="detail-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px' }}
          >
            {/* Modal Header */}
            <div className="detail-modal-header">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '16px',
                  background: 'var(--bg-subtle)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
                title="Close modal"
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-match" style={{ fontSize: '12px', padding: '4px 10px' }}>
                  <Sparkles size={13} /> {matchScore}% Overall Compatibility
                </span>
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
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Evaluated using Shakti's multi-criteria scoring algorithm against your profile skills, location, and preferred work mode.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div className="metric-row">
                      <span className="metric-label" style={{ fontSize: '13px', fontWeight: '600' }}>Skill Match (Experience & Craft)</span>
                      <span className="metric-value" style={{ fontWeight: '700' }}>{breakdown.skill_match || 92}%</span>
                    </div>
                    <div className="progress-container" style={{ height: '8px' }}>
                      <div className="progress-bar progress-bar-success" style={{ width: `${breakdown.skill_match || 92}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="metric-row">
                      <span className="metric-label" style={{ fontSize: '13px', fontWeight: '600' }}>Interest Alignment</span>
                      <span className="metric-value" style={{ fontWeight: '700' }}>{breakdown.interest_match || 90}%</span>
                    </div>
                    <div className="progress-container" style={{ height: '8px' }}>
                      <div className="progress-bar" style={{ width: `${breakdown.interest_match || 90}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="metric-row">
                      <span className="metric-label" style={{ fontSize: '13px', fontWeight: '600' }}>Location Proximity ({location})</span>
                      <span className="metric-value" style={{ fontWeight: '700' }}>{breakdown.location_match || 88}%</span>
                    </div>
                    <div className="progress-container" style={{ height: '8px' }}>
                      <div className="progress-bar progress-bar-accent" style={{ width: `${breakdown.location_match || 88}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="metric-row">
                      <span className="metric-label" style={{ fontSize: '13px', fontWeight: '600' }}>Work Mode Fit ({jobType || 'Flexible'})</span>
                      <span className="metric-value" style={{ fontWeight: '700' }}>{breakdown.work_preference || 95}%</span>
                    </div>
                    <div className="progress-container" style={{ height: '8px' }}>
                      <div className="progress-bar" style={{ width: `${breakdown.work_preference || 95}%` }} />
                    </div>
                  </div>
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
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {reasons.map((reason, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-body)' }}>
                        <CheckCircle2 size={15} color="var(--secondary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{reason}</span>
                      </div>
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
          </div>
        </div>
      )}
    </>
  );
}
