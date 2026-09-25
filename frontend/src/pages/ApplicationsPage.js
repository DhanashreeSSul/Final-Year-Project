import React, { useState } from 'react';
import { DEMO_APPLICANTS } from '../utils/demoData';
import {
  CheckCircle2,
  Clock,
  Briefcase,
  Building2,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([
    {
      id: 'app-1',
      job_title: 'Tailoring & Stitching Assistant',
      company: 'Mahila Vikas Foundation',
      location: 'Varanasi, UP',
      salary: '₹8,000–₹12,000/mo',
      applied_date: '02 Sep 2026',
      status: 'Shortlisted', // Applied, Under Review, Shortlisted, Interview, Selected
      timeline: [
        { title: 'Application Submitted', date: '02 Sep 2026', done: true },
        { title: 'Foundation Viewed Application', date: '03 Sep 2026', done: true },
        { title: 'Shortlisted for Trial Batch', date: '05 Sep 2026', done: true },
        { title: 'Practical Skill Trial at Village Center', date: 'Pending', done: false },
        { title: 'Final Onboarding & Sewing Machine Grant', date: 'Pending', done: false }
      ]
    },
    {
      id: 'app-2',
      job_title: 'Handicraft & Crochet Artisan',
      company: 'Rural Artisans Livelihood Collective',
      location: 'Varanasi, UP',
      salary: '₹7,000–₹11,000/mo',
      applied_date: '03 Sep 2026',
      status: 'Under Review',
      timeline: [
        { title: 'Application Submitted', date: '03 Sep 2026', done: true },
        { title: 'Foundation Viewed Application', date: '04 Sep 2026', done: true },
        { title: 'Sample Review by NGO Coordinator', date: 'In Progress', done: false },
        { title: 'Interview & Work Allocation', date: 'Pending', done: false }
      ]
    }
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="badge badge-secondary">Selected</span>;
      case 'Shortlisted':
        return <span className="badge badge-match">Shortlisted</span>;
      case 'Interview':
        return <span className="badge badge-accent">Interview Scheduled</span>;
      case 'Under Review':
        return <span className="badge badge-primary">Under Review</span>;
      default:
        return <span className="badge badge-neutral">Applied</span>;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '880px', paddingBottom: '60px' }}>
      <div className="page-header">
        <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
          <CheckCircle2 size={14} /> Transparent Tracking
        </div>
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">
          Track the status of your job applications with real-time feedback and clear next steps.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Briefcase size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>You haven't applied to any opportunities yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Explore jobs recommended for you based on your skills and location.
          </p>
          <Link to="/woman/jobs" className="btn btn-primary btn-sm">
            Browse Recommended Jobs
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {applications.map((app) => (
            <div key={app.id} className="card">
              <div className="card-body">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{app.job_title}</h3>
                    <div style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: '600', marginTop: '2px' }}>
                      {app.company} • {app.location}
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  <span>Applied on: <strong>{app.applied_date}</strong></span>
                  <span>Estimated wage: <strong>{app.salary}</strong></span>
                </div>

                {/* Visual Timeline */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                    Application Status Timeline
                  </div>

                  <div className="roadmap-timeline">
                    {app.timeline.map((step, idx) => (
                      <div key={idx} className="roadmap-step-item">
                        <div className={`roadmap-marker ${step.done ? 'completed' : 'active'}`}>
                          {step.done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        </div>
                        <div style={{ paddingLeft: '8px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: step.done ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {step.title}
                          </div>
                          <div style={{ fontSize: '12px', color: step.done ? 'var(--secondary-700)' : 'var(--text-light)', marginTop: '2px' }}>
                            {step.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
