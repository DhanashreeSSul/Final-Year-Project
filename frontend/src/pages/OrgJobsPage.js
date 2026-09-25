import React, { useState } from 'react';
import { DEMO_JOBS } from '../utils/demoData';
import {
  Briefcase,
  PlusCircle,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
  Eye,
  CheckCircle2,
  Trash2,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrgJobsPage() {
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [showPostModal, setShowPostModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // New Job Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    location_state: 'Uttar Pradesh',
    location_district: 'Varanasi',
    work_mode: 'Work from Home / Village Hub',
    job_type: 'Part-time',
    salary_min: 8000,
    salary_max: 12000,
    education: '8th Standard or Basic Literacy',
    experience: 'Informal stitching or tailoring experience',
    working_hours: '4-5 hours/day',
    application_deadline: '2026-10-31',
    seats: 10,
    women_specific: true
  });

  const handleCreateJob = (e) => {
    e.preventDefault();
    const newJob = {
      id: `job-${Date.now()}`,
      title: formData.title,
      company: 'Mahila Vikas Foundation',
      description: formData.description,
      skills_required: formData.skills_required.split(',').map(s => s.trim()),
      location_district: formData.location_district,
      location_state: formData.location_state,
      work_mode: formData.work_mode,
      job_type: formData.job_type,
      salary_min: Number(formData.salary_min),
      salary_max: Number(formData.salary_max),
      application_deadline: formData.application_deadline,
      seats: Number(formData.seats),
      match_score: 95
    };

    setJobs([newJob, ...jobs]);
    setShowPostModal(false);
    setPreviewMode(false);
    toast.success('Opportunity published! Automatically indexed by AI matching engine.');
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success('Job opportunity archived.');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>
            <Briefcase size={14} /> NGO Employer Portal
          </div>
          <h1 className="page-title">Manage Posted Opportunities</h1>
          <p className="page-subtitle">Publish jobs, track rural women applicants, and update openings.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { setShowPostModal(true); setPreviewMode(false); }}
        >
          <PlusCircle size={18} />
          <span>Post New Job Opportunity</span>
        </button>
      </div>

      {/* Jobs Table */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Active Openings ({jobs.length})</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Role Title</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Location & Mode</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Compensation</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Deadline</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Applicants</th>
                  <th style={{ padding: '12px 20px', fontWeight: '700', color: 'var(--text-muted)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{job.job_type}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div>{job.location_district}, {job.location_state}</div>
                      <div style={{ fontSize: '12px', color: 'var(--primary-700)', fontWeight: '500' }}>{job.work_mode}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--accent-700)' }}>
                      ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {job.application_deadline}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-primary">12 Applicants</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDeleteJob(job.id)}
                        style={{ color: 'var(--text-light)' }}
                        title="Archive Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Post Job Modal with Live Preview Toggle */}
      {showPostModal && (
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
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#ffffff', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
                  {previewMode ? 'Opportunity Preview' : 'Post New Job for Rural Women'}
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {previewMode ? 'Review how beneficiaries see this card' : 'Fill details below with simple requirements'}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye size={15} />
                <span>{previewMode ? 'Back to Edit' : 'Live Preview'}</span>
              </button>
            </div>

            {previewMode ? (
              /* Live Preview Card */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', border: '1.5px solid var(--primary-200)', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{formData.title || 'Untitled Opportunity'}</h3>
                    <div style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: '600' }}>Mahila Vikas Foundation</div>
                  </div>
                  <span className="badge badge-match">94% AI Fit</span>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {formData.description || 'Job description will appear here...'}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="badge badge-neutral"><MapPin size={13} /> {formData.location_district}, {formData.location_state}</span>
                  <span className="badge badge-accent"><IndianRupee size={13} /> ₹{Number(formData.salary_min).toLocaleString()} - ₹{Number(formData.salary_max).toLocaleString()}/mo</span>
                  <span className="badge badge-primary">{formData.job_type}</span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setPreviewMode(false)} style={{ flex: 1 }}>
                    Edit Form
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleCreateJob} style={{ flex: 1 }}>
                    Publish Now
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Form */
              <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Tailoring & Home Stitching Assistant"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Describe tasks in simple language (e.g. materials delivered to home, weekly collection)..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills (Comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Tailoring, Hand Stitching, Pattern Cutting"
                    value={formData.skills_required}
                    onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Location State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.location_state}
                      onChange={(e) => setFormData({ ...formData, location_state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location District</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.location_district}
                      onChange={(e) => setFormData({ ...formData, location_district: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Work Mode</label>
                    <select
                      className="form-control"
                      value={formData.work_mode}
                      onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                    >
                      <option value="Work from Home / Village Hub">Work from Home / Village Hub</option>
                      <option value="Village Common Service Center">Village Common Service Center</option>
                      <option value="Cluster Processing Unit">Cluster Processing Unit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Type</label>
                    <select
                      className="form-control"
                      value={formData.job_type}
                      onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                    >
                      <option value="Part-time">Part-time</option>
                      <option value="Flexible / Piece-rate">Flexible / Piece-rate</option>
                      <option value="Full-time">Full-time</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Min Salary (₹/mo)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.salary_min}
                      onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Salary (₹/mo)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.salary_max}
                      onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowPostModal(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Publish Opportunity
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
