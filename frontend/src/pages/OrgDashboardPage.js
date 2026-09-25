import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_APPLICANTS, DEMO_JOBS, DEMO_USERS } from '../utils/demoData';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  GraduationCap,
  PlusCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrgDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const orgData = user?.org || DEMO_USERS.foundation.org;

  const [applicants, setApplicants] = useState(DEMO_APPLICANTS);

  const handleStatusChange = (id, newStatus) => {
    setApplicants(prev =>
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
    toast.success(`Applicant status updated to "${newStatus}"! Notification dispatched.`);
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* 1. HEADER */}
      <div className="card" style={{ marginBottom: '28px', backgroundColor: '#ffffff' }}>
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--secondary-50)', color: 'var(--secondary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Welcome, {orgData.org_name}</h1>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {orgData.sector} • <span style={{ color: 'var(--secondary-700)', fontWeight: '600' }}>Verified NGO Partner</span>
                </div>
              </div>
            </div>
          </div>

          <Link to="/foundation/post-job" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Post New Opportunity</span>
          </Link>
        </div>
      </div>

      {/* 2. OVERVIEW STATS CARDS */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>ACTIVE JOBS</span>
              <Briefcase size={18} color="var(--primary-700)" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>4</div>
            <div style={{ fontSize: '12px', color: 'var(--secondary-700)', marginTop: '4px' }}>Across 2 rural districts</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>TOTAL APPLICANTS</span>
              <Users size={18} color="var(--primary-700)" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>38</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>+6 new this week</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>SHORTLISTED</span>
              <Sparkles size={18} color="var(--secondary-600)" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--secondary-600)', marginTop: '8px' }}>12</div>
            <div style={{ fontSize: '12px', color: 'var(--secondary-700)', marginTop: '4px' }}>Ready for village trial</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>TRAINING PROGRAMS</span>
              <GraduationCap size={18} color="var(--accent-600)" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent-600)', marginTop: '8px' }}>2</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>55 enrolled beneficiaries</div>
          </div>
        </div>
      </div>

      {/* 3. RECENT APPLICATIONS TABLE / LIST */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Applications from Rural Women</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Filtered by candidate compatibility algorithm with verified contact links
            </p>
          </div>
          <Link to="/foundation/applicants" className="btn btn-outline btn-sm">
            View All ({applicants.length})
          </Link>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Applicant</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Applied For</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Skills & Location</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Match Score</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{app.applicant_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{app.phone}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--primary-800)', fontWeight: '600' }}>
                      {app.job_title}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                        {app.skills.map(s => (
                          <span key={s} className="badge badge-primary" style={{ fontSize: '10px' }}>{s}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.location}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-match">{app.match_score}% Fit</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge ${app.status === 'Shortlisted' ? 'badge-secondary' : 'badge-neutral'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleStatusChange(app.id, 'Under Review')}
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
