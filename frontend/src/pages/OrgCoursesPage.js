import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Award, Clock, Monitor } from 'lucide-react';
import { coursesAPI } from '../utils/api';
import Modal from '../components/shared/Modal';
import toast from 'react-hot-toast';

const CATS = ['Digital Literacy','Tailoring','Agriculture','Healthcare','Finance','IT','Handicrafts','Education','Other'];
const SKILLS = ['Sewing','Computer Basics','MS Office','Digital Marketing','Accounting','Mobile Banking','Farming','Cooking','Photography','Data Entry','Teaching','Healthcare'];
const LANGS = ['English','Hindi','Marathi','Telugu','Tamil','Kannada','Gujarati','Bengali'];
const STATES = ['Andhra Pradesh','Bihar','Gujarat','Karnataka','Maharashtra','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

const emptyCourse = { title:'', description:'', duration:'', mode:'online', language:[], skills_taught:[], certification:false, is_free:true, fee:0, location_state:'', location_district:'', start_date:'', end_date:'', seats:'', category:'' };

export default function OrgCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyCourse);
  const [saving, setSaving] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await coursesAPI.getAll({ limit: 50 });
      setCourses(res.data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSave = async () => {
    if (!form.title || !form.description) return toast.error('Title and description required');
    setSaving(true);
    try {
      await coursesAPI.create(form);
      toast.success('Course created!');
      setModalOpen(false); fetchCourses();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const toggleArr = (key, val) => setForm(p=>({ ...p, [key]: (p[key]||[]).includes(val) ? (p[key]||[]).filter(x=>x!==val) : [...(p[key]||[]),val] }));
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div className="page-container animate-in">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div><h1 className="page-title">Training Courses</h1><p className="page-subtitle">Manage your skill development programs</p></div>
        <button className="btn btn-primary" onClick={()=>{setForm(emptyCourse);setModalOpen(true);}}><Plus size={15}/> Add Course</button>
      </div>

      {loading ? <div className="spinner-pink"/> : courses.length===0 ? (
        <div className="card card-body" style={{textAlign:'center',padding:48}}>
          <p style={{color:'var(--gray-400)',marginBottom:16}}>No courses yet. Create your first training program.</p>
          <button className="btn btn-primary" onClick={()=>setModalOpen(true)}><Plus size={14}/> Create Course</button>
        </div>
      ) : (
        <div className="grid grid-2">
          {courses.map(c=>(
            <div key={c.id} className="card">
              <div style={{height:5,background:'linear-gradient(90deg,var(--pink-400),var(--purple-500))',borderRadius:'var(--radius-lg) var(--radius-lg) 0 0'}}/>
              <div className="card-body">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                  <span className="badge badge-pink">{c.category||'Course'}</span>
                  <div style={{display:'flex',gap:4}}>
                    {c.is_free && <span className="badge badge-green">Free</span>}
                    {c.certification && <span className="badge badge-purple"><Award size={10}/> Cert</span>}
                  </div>
                </div>
                <div style={{fontWeight:600,fontSize:15,color:'var(--gray-800)',marginBottom:4}}>{c.title}</div>
                <p style={{fontSize:13,color:'var(--gray-400)',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{c.description}</p>
                <div style={{display:'flex',gap:10,marginTop:10,fontSize:12,color:'var(--gray-500)'}}>
                  {c.duration && <span style={{display:'flex',alignItems:'center',gap:3}}><Clock size={11}/>{c.duration}</span>}
                  {c.mode && <span style={{display:'flex',alignItems:'center',gap:3}}><Monitor size={11}/>{c.mode}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title="Create Training Course">
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Course Title *</label>
            <input className="form-control" value={form.title} onChange={e=>upd('title',e.target.value)} placeholder="e.g. Basic Computer Skills"/>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Description *</label>
            <textarea className="form-control" value={form.description} onChange={e=>upd('description',e.target.value)} rows={3} placeholder="What will participants learn?"/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={e=>upd('category',e.target.value)}>
                <option value="">Select</option>{CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Mode</label>
              <select className="form-control" value={form.mode} onChange={e=>upd('mode',e.target.value)}>
                {['online','offline','hybrid'].map(m=><option key={m} style={{textTransform:'capitalize'}}>{m}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Duration</label>
              <input className="form-control" value={form.duration} onChange={e=>upd('duration',e.target.value)} placeholder="e.g. 4 weeks, 3 months"/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Seats Available</label>
              <input className="form-control" type="number" value={form.seats} onChange={e=>upd('seats',e.target.value)} placeholder="e.g. 20"/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Start Date</label>
              <input className="form-control" type="date" value={form.start_date} onChange={e=>upd('start_date',e.target.value)}/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">End Date</label>
              <input className="form-control" type="date" value={form.end_date} onChange={e=>upd('end_date',e.target.value)}/>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">State</label>
              <select className="form-control" value={form.location_state} onChange={e=>upd('location_state',e.target.value)}>
                <option value="">Select</option>{STATES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">District</label>
              <input className="form-control" value={form.location_district} onChange={e=>upd('location_district',e.target.value)} placeholder="District"/>
            </div>
          </div>
          <div style={{display:'flex',gap:16}}>
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14}}>
              <input type="checkbox" checked={form.is_free} onChange={e=>upd('is_free',e.target.checked)} style={{accentColor:'var(--pink-600)',width:16,height:16}}/>
              Free Course
            </label>
            {!form.is_free && <div style={{flex:1}}><input className="form-control" type="number" value={form.fee} onChange={e=>upd('fee',e.target.value)} placeholder="Fee in ₹"/></div>}
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:14}}>
              <input type="checkbox" checked={form.certification} onChange={e=>upd('certification',e.target.checked)} style={{accentColor:'var(--pink-600)',width:16,height:16}}/>
              Provides Certificate
            </label>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Skills Taught</label>
            <div className="tag-list">
              {SKILLS.map(s=>(
                <button key={s} type="button" onClick={()=>toggleArr('skills_taught',s)} style={{padding:'4px 10px',borderRadius:999,fontSize:12,cursor:'pointer',border:'1.5px solid',background:(form.skills_taught||[]).includes(s)?'var(--pink-600)':'white',color:(form.skills_taught||[]).includes(s)?'white':'var(--pink-600)',borderColor:'var(--pink-200)'}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group" style={{marginBottom:0}}>
            <label className="form-label">Languages Available</label>
            <div className="tag-list">
              {LANGS.map(l=>(
                <button key={l} type="button" onClick={()=>toggleArr('language',l)} style={{padding:'4px 10px',borderRadius:999,fontSize:12,cursor:'pointer',border:'1.5px solid',background:(form.language||[]).includes(l)?'var(--purple-500)':'white',color:(form.language||[]).includes(l)?'white':'var(--purple-500)',borderColor:'#e9d5ff'}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button className="btn btn-secondary" onClick={()=>setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving?<><span className="spinner"/>Saving...</>:'Create Course'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
