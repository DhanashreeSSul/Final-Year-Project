import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, MapPin, Users } from 'lucide-react';
import { jobsAPI, orgAPI } from '../utils/api';
import Modal from '../components/shared/Modal';
import toast from 'react-hot-toast';

const SKILLS = ['Sewing','Embroidery','Farming','MS Office','Computer','Accounting','Teaching','Healthcare','Retail','Customer Service','Data Entry','Photography','Cooking','Handicrafts'];
const CATS = ['Agriculture','Handicrafts','Healthcare','Education','IT','Tailoring','Retail','Finance','Social Work','Other'];
const STATES = ['Andhra Pradesh','Bihar','Chhattisgarh','Gujarat','Karnataka','Maharashtra','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

const emptyJob = { title:'', description:'', job_type:'full-time', work_mode:'onsite', location_state:'', location_district:'', salary_min:'', salary_max:'', skills_required:[], education_required:'', language_required:[], application_deadline:'', seats:'', category:'' };

export default function OrgJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyJob);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      const orgRes = await orgAPI.get();
      if (orgRes.data.data) {
        setOrgId(orgRes.data.data.id);
        const res = await jobsAPI.getAll({ limit: 50 });
        // Filter to org's jobs - in real app would have org-specific endpoint
        setJobs(res.data.data);
      }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const openCreate = () => { setForm(emptyJob); setEditId(null); setModalOpen(true); };
  const openEdit = (job) => { setForm({...job, skills_required: job.skills_required||[], language_required: job.language_required||[]}); setEditId(job.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.description) return toast.error('Title and description are required');
    setSaving(true);
    try {
      if (editId) {
        await jobsAPI.update(editId, form);
        toast.success('Job updated!');
      } else {
        await jobsAPI.create(form);
        toast.success('Job posted!');
      }
      setModalOpen(false); fetchJobs();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this job listing?')) return;
    try { await jobsAPI.delete(id); toast.success('Job removed'); fetchJobs(); }
    catch { toast.error('Failed to remove'); }
  };

  const toggleSkill = (s) => setForm(p=>({...p, skills_required: p.skills_required.includes(s)?p.skills_required.filter(x=>x!==s):[...p.skills_required,s]}));
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div className="page-container animate-in">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div><h1 className="page-title">Job Listings</h1><p className="page-subtitle">Manage your posted opportunities</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15}/> Post New Job</button>
      </div>

      {loading ? <div className="spinner-pink"/> : jobs.length===0 ? (
        <div className="card card-body" style={{textAlign:'center',padding:48}}>
          <p style={{color:'var(--gray-400)',marginBottom:16}}>No jobs posted yet.</p>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={14}/> Post Your First Job</button>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {jobs.map(job=>(
            <div key={job.id} className="card card-body" style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:15,color:'var(--gray-800)'}}>{job.title}</div>
                <div style={{fontSize:13,color:'var(--gray-400)',marginTop:3,display:'flex',gap:10}}>
                  {job.location_district && <span style={{display:'flex',alignItems:'center',gap:3}}><MapPin size={11}/>{job.location_district}</span>}
                  {job.seats && <span style={{display:'flex',alignItems:'center',gap:3}}><Users size={11}/>{job.seats} seats</span>}
                  <span style={{textTransform:'capitalize'}}>{job.work_mode}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span className={`badge ${job.is_active?'badge-green':'badge-pink'}`}>{job.is_active?'Active':'Closed'}</span>
                <button onClick={()=>openEdit(job)} className="btn btn-secondary btn-sm"><Edit2 size={13}/></button>
                <button onClick={()=>handleDelete(job.id)} className="btn btn-sm" style={{background:'#fee2e2',color:'#dc2626',border:'none'}}><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editId?'Edit Job':'Post New Job'}>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Job Title *</label>
            <input className="form-control" value={form.title} onChange={e=>upd('title',e.target.value)} placeholder="e.g. Tailoring Instructor"/>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Description *</label>
            <textarea className="form-control" value={form.description} onChange={e=>upd('description',e.target.value)} rows={4} placeholder="Job responsibilities, requirements, benefits..."/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Job Type</label>
              <select className="form-control" value={form.job_type} onChange={e=>upd('job_type',e.target.value)}>
                {['full-time','part-time','contract','internship','volunteer'].map(t=><option key={t} style={{textTransform:'capitalize'}}>{t}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Work Mode</label>
              <select className="form-control" value={form.work_mode} onChange={e=>upd('work_mode',e.target.value)}>
                {['onsite','remote','hybrid'].map(t=><option key={t} style={{textTransform:'capitalize'}}>{t}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">State</label>
              <select className="form-control" value={form.location_state} onChange={e=>upd('location_state',e.target.value)}>
                <option value="">Select</option>
                {STATES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">District</label>
              <input className="form-control" value={form.location_district} onChange={e=>upd('location_district',e.target.value)} placeholder="District"/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Min Salary (₹/mo)</label>
              <input className="form-control" type="number" value={form.salary_min} onChange={e=>upd('salary_min',e.target.value)} placeholder="e.g. 8000"/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Max Salary (₹/mo)</label>
              <input className="form-control" type="number" value={form.salary_max} onChange={e=>upd('salary_max',e.target.value)} placeholder="e.g. 15000"/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={e=>upd('category',e.target.value)}>
                <option value="">Select</option>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">No. of Seats</label>
              <input className="form-control" type="number" value={form.seats} onChange={e=>upd('seats',e.target.value)} placeholder="e.g. 5"/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Application Deadline</label>
              <input className="form-control" type="date" value={form.application_deadline} onChange={e=>upd('application_deadline',e.target.value)}/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Education Required</label>
              <input className="form-control" value={form.education_required} onChange={e=>upd('education_required',e.target.value)} placeholder="e.g. Class 8 pass"/>
            </div>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Skills Required</label>
            <div className="tag-list">
              {SKILLS.map(s=>(
                <button key={s} type="button" onClick={()=>toggleSkill(s)} style={{padding:'4px 10px',borderRadius:999,fontSize:12,cursor:'pointer',border:'1.5px solid',background:(form.skills_required||[]).includes(s)?'var(--pink-600)':'white',color:(form.skills_required||[]).includes(s)?'white':'var(--pink-600)',borderColor:'var(--pink-200)'}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn btn-secondary" onClick={()=>setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving?<><span className="spinner"/>Saving...</>:editId?'Update Job':'Post Job'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
