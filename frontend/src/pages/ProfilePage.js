import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit2, Save, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, applicationsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const SKILLS_LIST = ['Sewing','Embroidery','Cooking','Farming','Accounting','Computer Basics','MS Office','Digital Marketing','Mobile Banking','Teaching','Healthcare','Handicrafts','Pottery','Weaving','Retail','Customer Service','Data Entry','English Speaking','Drawing','Photography'];
const INTERESTS = ['Agriculture','Arts & Crafts','Teaching','Healthcare','Business','Technology','Textile','Food Processing','Social Work','Finance','Environment'];
const EDUCATIONS = ['No Formal Education','Primary (Class 1-5)','Middle School (Class 6-8)','Secondary (Class 9-10)','Higher Secondary (Class 11-12)','Graduate','Post Graduate'];
const STATES = ['Andhra Pradesh','Bihar','Chhattisgarh','Gujarat','Jharkhand','Karnataka','Madhya Pradesh','Maharashtra','Odisha','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal','Other'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ name:'', state:'', district:'', village:'', language_pref:'en', age:'', education:'', skills:[], interests:[], languages_known:[], work_experience:'', bio:'' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        state: user.state || '',
        district: user.district || '',
        village: user.village || '',
        language_pref: user.language_pref || 'en',
        age: user.age || '',
        education: user.education || '',
        skills: user.skills || [],
        interests: user.interests || [],
        languages_known: user.languages_known || [],
        work_experience: user.work_experience || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'applications') {
      applicationsAPI.getMy().then(r => setApplications(r.data.data)).catch(() => {});
    }
  }, [activeTab]);

  const toggleSkill = (skill) => {
    setForm(p => ({ ...p, skills: p.skills.includes(skill) ? p.skills.filter(s=>s!==skill) : [...p.skills, skill] }));
  };
  const toggleInterest = (interest) => {
    setForm(p => ({ ...p, interests: p.interests.includes(interest) ? p.interests.filter(s=>s!==interest) : [...p.interests, interest] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile(form);
      updateUser(form);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update profile'); }
    finally { setSaving(false); }
  };

  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const statusColors = { applied:'badge-amber', shortlisted:'badge-purple', selected:'badge-green', rejected:'badge-pink', enrolled:'badge-teal' };

  return (
    <div className="page-container animate-in">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">{(user?.name||'U')[0].toUpperCase()}</div>
        <div className="profile-info" style={{flex:1}}>
          <h2>{user?.name}</h2>
          <p style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
            <MapPin size={13}/>{user?.district ? `${user.district}, ` : ''}{user?.state || 'Location not set'}
          </p>
          <p style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
            <Phone size={13}/>{user?.phone}
          </p>
          {user?.email && <p style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}><Mail size={13}/>{user.email}</p>}
        </div>
        <button onClick={()=>setEditing(e=>!e)} className="btn" style={{background:'rgba(255,255,255,0.2)',color:'white',border:'1.5px solid rgba(255,255,255,0.4)'}}>
          {editing ? <><X size={14}/> Cancel</> : <><Edit2 size={14}/> Edit Profile</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['profile','applications','bookmarks'].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} className={`tab-btn ${activeTab===t?'active':''}`} style={{textTransform:'capitalize'}}>{t}</button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:20}}>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {/* Basic Info */}
            <div className="card card-body">
              <h3 style={{fontSize:18,marginBottom:16}}>Personal Information</h3>
              {editing ? (
                <div style={{display:'grid',gap:14}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">Full Name</label>
                      <input className="form-control" value={form.name} onChange={e=>upd('name',e.target.value)}/>
                    </div>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">Age</label>
                      <input className="form-control" type="number" value={form.age} onChange={e=>upd('age',e.target.value)} placeholder="Your age"/>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">State</label>
                      <select className="form-control" value={form.state} onChange={e=>upd('state',e.target.value)}>
                        <option value="">Select</option>
                        {STATES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">District</label>
                      <input className="form-control" value={form.district} onChange={e=>upd('district',e.target.value)} placeholder="Your district"/>
                    </div>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Village / Town</label>
                    <input className="form-control" value={form.village} onChange={e=>upd('village',e.target.value)} placeholder="Village name"/>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Education Level</label>
                    <select className="form-control" value={form.education} onChange={e=>upd('education',e.target.value)}>
                      <option value="">Select</option>
                      {EDUCATIONS.map(e=><option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Work Experience</label>
                    <select className="form-control" value={form.work_experience} onChange={e=>upd('work_experience',e.target.value)}>
                      <option value="">Select</option>
                      <option>No experience</option><option>Less than 1 year</option><option>1–2 years</option><option>3–5 years</option><option>More than 5 years</option>
                    </select>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">About You</label>
                    <textarea className="form-control" value={form.bio} onChange={e=>upd('bio',e.target.value)} placeholder="Tell us about yourself, your goals..." rows={3}/>
                  </div>
                </div>
              ) : (
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {[['Name', user?.name],['Age', user?.age||'Not set'],['State', user?.state||'Not set'],['District', user?.district||'Not set'],['Village', user?.village||'Not set'],['Education', user?.education||'Not set'],['Experience', user?.work_experience||'Not set']].map(([k,v])=>(
                    <div key={k}>
                      <div style={{fontSize:11,color:'var(--gray-400)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>{k}</div>
                      <div style={{fontSize:14,color:'var(--gray-700)',fontWeight:500}}>{v}</div>
                    </div>
                  ))}
                  {user?.bio && <div style={{gridColumn:'1/-1'}}><div style={{fontSize:11,color:'var(--gray-400)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>About</div><div style={{fontSize:14,color:'var(--gray-600)',lineHeight:1.6}}>{user.bio}</div></div>}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="card card-body">
              <h3 style={{fontSize:18,marginBottom:12}}>Skills</h3>
              {editing ? (
                <div className="tag-list">{SKILLS_LIST.map(s=>(
                  <button key={s} onClick={()=>toggleSkill(s)} style={{padding:'5px 12px',borderRadius:999,fontSize:12,fontWeight:500,cursor:'pointer',border:'1.5px solid',transition:'all 0.15s',background:form.skills.includes(s)?'var(--pink-600)':'white',color:form.skills.includes(s)?'white':'var(--pink-600)',borderColor:'var(--pink-200)'}}>
                    {s}
                  </button>
                ))}</div>
              ) : (
                <div className="tag-list">
                  {(user?.skills||[]).length>0 ? user.skills.map(s=><span key={s} className="tag">{s}</span>) : <p style={{fontSize:13,color:'var(--gray-400)'}}>No skills added yet. Click Edit to add.</p>}
                </div>
              )}
            </div>

            {/* Interests */}
            <div className="card card-body">
              <h3 style={{fontSize:18,marginBottom:12}}>Interests</h3>
              {editing ? (
                <div className="tag-list">{INTERESTS.map(s=>(
                  <button key={s} onClick={()=>toggleInterest(s)} style={{padding:'5px 12px',borderRadius:999,fontSize:12,fontWeight:500,cursor:'pointer',border:'1.5px solid',transition:'all 0.15s',background:form.interests.includes(s)?'var(--purple-500)':'white',color:form.interests.includes(s)?'white':'var(--purple-500)',borderColor:'#e9d5ff'}}>
                    {s}
                  </button>
                ))}</div>
              ) : (
                <div className="tag-list">
                  {(user?.interests||[]).length>0 ? user.interests.map(s=><span key={s} className="tag" style={{background:'#f3e8ff',color:'var(--purple-500)'}}>{s}</span>) : <p style={{fontSize:13,color:'var(--gray-400)'}}>No interests added yet.</p>}
                </div>
              )}
            </div>

            {editing && (
              <div style={{display:'flex',gap:10}}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{flex:1}}>
                  {saving ? <><span className="spinner"/>Saving...</> : <><Save size={14}/> Save Profile</>}
                </button>
                <button className="btn btn-secondary" onClick={()=>setEditing(false)}>Cancel</button>
              </div>
            )}
          </div>

          {/* Right sidebar stats */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="card card-body">
              <h4 style={{fontSize:15,marginBottom:12}}>Profile Strength</h4>
              <div style={{marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6}}>
                  <span style={{color:'var(--gray-600)'}}>Completeness</span>
                  <span style={{fontWeight:600,color:'var(--pink-600)'}}>
                    {Math.round((['name','state','district','education','work_experience'].filter(k=>user?.[k]).length / 5)*100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width:`${Math.round((['name','state','district','education','work_experience'].filter(k=>user?.[k]).length/5)*100)}%`}}/>
                </div>
              </div>
              {['name','state','skills','interests','education'].filter(k=>!(user?.[k]||(user?.[k]||[]).length)).map(k=>(
                <div key={k} style={{fontSize:12,color:'var(--gray-400)',display:'flex',alignItems:'center',gap:6,marginTop:6}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:'var(--pink-200)'}}/> Add {k}
                </div>
              ))}
            </div>
            <div className="card card-body" style={{textAlign:'center',padding:20}}>
              <div style={{fontSize:32,fontWeight:700,color:'var(--pink-700)',fontFamily:'var(--font-display)'}}>{user?.role === 'user' ? 'Women' : 'Org'}</div>
              <div style={{fontSize:12,color:'var(--gray-400)',marginTop:4}}>Account Type</div>
              <div style={{marginTop:12,padding:'6px 0',borderTop:'1px solid var(--pink-50)'}}>
                <div style={{fontSize:12,color:'var(--green-600)',fontWeight:600}}>Verified Account</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <h3 style={{fontSize:18}}>My Applications ({applications.length})</h3>
          {applications.length === 0 ? (
            <div className="card card-body" style={{textAlign:'center',padding:40,color:'var(--gray-400)'}}>
              <p>No applications yet. Browse jobs, courses, and schemes to apply.</p>
            </div>
          ) : applications.map(a => (
            <div key={a.id} className="card card-body" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:600,color:'var(--gray-800)'}}>{a.entity_title || 'Unknown'}</div>
                <div style={{fontSize:13,color:'var(--gray-400)',marginTop:4,textTransform:'capitalize'}}>
                  {a.entity_type} · Applied {new Date(a.applied_at).toLocaleDateString('en-IN')}
                </div>
              </div>
              <span className={`badge ${statusColors[a.status]||'badge-pink'}`} style={{textTransform:'capitalize'}}>{a.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="card card-body" style={{textAlign:'center',padding:40,color:'var(--gray-400)'}}>
          <p>Saved items will appear here. Tap the bookmark icon on any job or course to save it.</p>
        </div>
      )}
    </div>
  );
}
