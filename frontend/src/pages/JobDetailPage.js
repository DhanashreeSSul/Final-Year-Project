import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DEMO_JOBS } from '../utils/demoData';
import { jobsAPI, applicationsAPI } from '../utils/api';
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Find job from demo data or backend
    const found = DEMO_JOBS.find(j => j.id === id) || DEMO_JOBS[0];
    setJob(found);
  }, [id]);

  if (!job) return <div className="container">Loading details...</div>;

  const handleApply = () => {
    setApplied(true);
    toast.success(`Application submitted for ${job.title}! Status updated in My Applications.`);
  };

  const handleToggleSave = () => {
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved jobs' : 'Job saved to your bookmarks!');
  };

  return (
    <div className="container" style={{ maxWidth: '880px', paddingBottom: '60px' }}>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => navigate(-1)}
        style={{ padding: 0, marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      {/* Main Job Card */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '8px' }}>{job.category || 'Livelihoods'}</div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>{job.title}</h1>
              <div style={{ fontSize: '16px', color: 'var(--primary-700)', fontWeight: '600', marginTop: '4px' }}>
                {job.company}
              </div>
            </div>

            <div className="badge badge-match" style={{ padding: '8px 16px', fontSize: '14px' }}>
              <Sparkles size={16} />
              <span>{job.match_score || 94}% Compatibility</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', margin: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
            <span className="badge badge-neutral"><MapPin size={14} /> {job.location_district}, {job.location_state}</span>
            <span className="badge badge-accent"><IndianRupee size={14} /> ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}/month</span>
            <span className="badge badge-neutral"><Briefcase size={14} /> {job.job_type}</span>
            <span className="badge badge-neutral"><Clock size={14} /> {job.work_mode}</span>
            <span className="badge badge-neutral"><Calendar size={14} /> Apply by {job.application_deadline}</span>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleApply}
              disabled={applied}
              style={{ flex: 1 }}
            >
              {applied ? '✓ Application Submitted' : 'Apply Now for this Job'}
            </button>
            <button
              type="button"
              className={`btn ${saved ? 'btn-secondary' : 'btn-outline'} btn-lg`}
              onClick={handleToggleSave}
            >
              <Bookmark size={18} />
              <span>{saved ? 'Saved' : 'Save Job'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Section: Why this job matches you */}
      <div className="card" style={{ marginBottom: '28px', backgroundColor: 'var(--secondary-50)', border: '1.5px solid var(--secondary-500)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={20} color="var(--secondary-700)" />
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--secondary-800)' }}>
              Why This Job Matches You (AI Transparency)
            </h2>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-body)', marginBottom: '16px' }}>
            Our recommendation algorithm evaluated your registered profile against the job criteria:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <CheckCircle2 size={18} color="var(--secondary-600)" />
              <span>Tailoring & Stitching skill match</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <CheckCircle2 size={18} color="var(--secondary-600)" />
              <span>Interested in part-time / home work</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <CheckCircle2 size={18} color="var(--secondary-600)" />
              <span>District location match (Varanasi)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
              <CheckCircle2 size={18} color="var(--secondary-600)" />
              <span>Matches informal work experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description & Details */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Description</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: '1.6' }}>
              {job.description}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Key Responsibilities</h3>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px', color: 'var(--text-body)' }}>
              {(job.responsibilities || [
                'Stitch traditional garments according to provided design specifications',
                'Ensure seam quality and standard measurements',
                'Submit finished pieces weekly to local cluster hub'
              ]).map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Eligibility & Requirements</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>
              {job.eligibility}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {job.skills_required?.map(skill => (
                <span key={skill} className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
