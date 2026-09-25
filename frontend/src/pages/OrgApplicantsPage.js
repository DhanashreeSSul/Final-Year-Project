import React, { useState } from 'react';
import { DEMO_APPLICANTS } from '../utils/demoData';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrgApplicantsPage() {
  const [applicants, setApplicants] = useState(DEMO_APPLICANTS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleShortlist = (id) => {
    setApplicants(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'Shortlisted' } : a)
    );
    toast.success('Applicant shortlisted! Direct village coordinator notification sent.');
  };

  const filtered = applicants.filter(a =>
    filterStatus === 'all' ? true : a.status.toLowerCase() === filterStatus.toLowerCase()
  );

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>
            <Sparkles size={14} /> AI-Assisted Candidate Matcher
          </div>
          <h1 className="page-title">Rural Women Candidate Matching</h1>
          <p className="page-subtitle">
            Candidates automatically scored on skill compatibility, district proximity, and work schedule availability.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({applicants.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'shortlisted' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterStatus('shortlisted')}
          >
            Shortlisted
          </button>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid-2">
        {filtered.map((cand) => (
          <div key={cand.id} className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    {cand.applicant_name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{cand.applicant_name}</h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Applied for: <strong>{cand.job_title}</strong>
                    </div>
                  </div>
                </div>

                <span className="badge badge-match">{cand.match_score}% Fit</span>
              </div>

              {/* Skills and Location */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                <span className="badge badge-neutral"><MapPin size={13} /> {cand.location}</span>
                <span className="badge badge-neutral"><Briefcase size={13} /> {cand.experience}</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {cand.skills.map(s => (
                  <span key={s} className="badge badge-primary">{s}</span>
                ))}
              </div>

              {/* AI Explainability: Why this applicant matches */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary-800)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  WHY THIS APPLICANT MATCHES:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {cand.match_reasons?.map((reason, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-body)' }}>
                      <CheckCircle2 size={13} color="var(--secondary-600)" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedApplicant(cand)}
                  style={{ flex: 1 }}
                >
                  View Profile
                </button>
                <button
                  type="button"
                  className={`btn ${cand.status === 'Shortlisted' ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  onClick={() => handleShortlist(cand.id)}
                  style={{ flex: 1 }}
                >
                  {cand.status === 'Shortlisted' ? '✓ Shortlisted' : 'Shortlist Candidate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Profile Details Modal */}
      {selectedApplicant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  {selectedApplicant.applicant_name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{selectedApplicant.applicant_name}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedApplicant.location}</div>
                </div>
              </div>
              <span className="badge badge-match">{selectedApplicant.match_score}% Match</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', marginBottom: '20px' }}>
              <div><strong>Phone:</strong> {selectedApplicant.phone}</div>
              <div><strong>Applied Role:</strong> {selectedApplicant.job_title}</div>
              <div><strong>Experience:</strong> {selectedApplicant.experience}</div>
              <div><strong>Skills:</strong> {selectedApplicant.skills.join(', ')}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedApplicant(null)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleShortlist(selectedApplicant.id);
                  setSelectedApplicant(null);
                }}
                style={{ flex: 1 }}
              >
                Confirm Shortlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
