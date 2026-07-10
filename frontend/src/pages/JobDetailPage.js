import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Users, Calendar, ChevronLeft, Send } from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/shared/Modal';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    jobsAPI.getOne(id).then(r => setJob(r.data.data)).catch(() => toast.error('Job not found')).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await applicationsAPI.apply({ entity_id: id, entity_type: 'job', cover_letter: coverLetter });
      setApplied(true); setModalOpen(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally { setApplying(false); }
  };

  if (loading) return <div className="spinner-pink" />;
  if (!job) return <div className="page-container"><h2>Job not found</h2><Link to="/jobs">Back to Jobs</Link></div>;

  return (
    <div className="page-container animate-in">
      <Link to="/jobs" className="btn btn-ghost btn-sm" style={{marginBottom:16}}><ChevronLeft size={16}/> Back to Jobs</Link>
      <div className="detail-header">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              {job.category && <span className="badge badge-pink">{job.category}</span>}
              {job.work_mode && <span className="badge badge-teal" style={{textTransform:'capitalize'}}>{job.work_mode}</span>}
            </div>
            <h1 className="detail-title">{job.title}</h1>
            <p style={{color:'var(--pink-600)',fontWeight:600,fontSize:16}}>{job.org_name}</p>
          </div>
          {job.salary_min && (
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:22,fontWeight:700,color:'var(--pink-700)',fontFamily:'var(--font-display)'}}>
                ₹{job.salary_min.toLocaleString()}{job.salary_max ? `–${job.salary_max.toLocaleString()}` : '+'}
              </div>
              <div style={{fontSize:12,color:'var(--gray-400)'}}>per month</div>
            </div>
          )}
        </div>
        <div style={{display:'flex',gap:16,marginTop:16,flexWrap:'wrap'}}>
          {job.location_district && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><MapPin size={14}/>{job.location_district}, {job.location_state}</span>}
          {job.job_type && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><Clock size={14}/>{job.job_type}</span>}
          {job.seats && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><Users size={14}/>{job.seats} openings</span>}
          {job.application_deadline && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><Calendar size={14}/>Deadline: {new Date(job.application_deadline).toLocaleDateString('en-IN')}</span>}
        </div>
        <div className="detail-actions">
          {applied ? (
            <span className="badge badge-green" style={{padding:'10px 20px',fontSize:14}}>Application Submitted</span>
          ) : (
            <button className="btn btn-primary" onClick={() => user ? setModalOpen(true) : navigate('/login')}>
              <Send size={16}/> Apply Now
            </button>
          )}
          <Link to="/chatbot" className="btn btn-secondary">Ask AI Guide</Link>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:20}}>
        <div>
          <div className="card card-body" style={{marginBottom:16}}>
            <h3 style={{fontSize:18,marginBottom:12}}>Job Description</h3>
            <p style={{fontSize:14,color:'var(--gray-600)',lineHeight:1.8,whiteSpace:'pre-line'}}>{job.description}</p>
          </div>
          {job.org_desc && (
            <div className="card card-body">
              <h3 style={{fontSize:18,marginBottom:12}}>About {job.org_name}</h3>
              <p style={{fontSize:14,color:'var(--gray-600)',lineHeight:1.8}}>{job.org_desc}</p>
            </div>
          )}
        </div>
        <div>
          {job.skills_required?.length > 0 && (
            <div className="card card-body" style={{marginBottom:12}}>
              <h4 style={{fontSize:15,marginBottom:10}}>Skills Required</h4>
              <div className="tag-list">{job.skills_required.map(s=><span key={s} className="tag">{s}</span>)}</div>
            </div>
          )}
          {job.education_required && (
            <div className="card card-body" style={{marginBottom:12}}>
              <h4 style={{fontSize:15,marginBottom:8}}>Education</h4>
              <p style={{fontSize:13,color:'var(--gray-600)'}}>{job.education_required}</p>
            </div>
          )}
          {job.language_required?.length > 0 && (
            <div className="card card-body">
              <h4 style={{fontSize:15,marginBottom:10}}>Languages</h4>
              <div className="tag-list">{job.language_required.map(l=><span key={l} className="tag">{l}</span>)}</div>
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Apply for this Job">
        <div className="form-group">
          <label className="form-label">Cover Letter (optional)</label>
          <textarea className="form-control" rows={5} placeholder="Tell us why you're a great fit for this role..." value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} />
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button className="btn btn-secondary" onClick={()=>setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
            {applying ? <><span className="spinner"/>Submitting...</> : <><Send size={14}/> Submit Application</>}
          </button>
        </div>
      </Modal>
    </div>
  );
}
