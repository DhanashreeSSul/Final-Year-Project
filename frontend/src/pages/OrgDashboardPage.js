import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, Users, TrendingUp, Plus, Building2, ChevronRight } from 'lucide-react';
import { orgAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OrgDashboardPage() {
  const { user } = useAuth();
  const [org, setOrg] = useState(null);
  const [stats, setStats] = useState({ active_jobs: 0, active_courses: 0, total_applications: 0 });
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [form, setForm] = useState({ org_name:'', org_type:'NGO', registration_number:'', description:'', website:'', address:'', state:'', district:'', contact_person:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      orgAPI.get().then(r => { setOrg(r.data.data); if (!r.data.data) setSetupMode(true); }),
      orgAPI.getDashboard().then(r => setStats(r.data.data)).catch(()=>{}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSetup = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await orgAPI.upsert(form);
      setOrg(res.data.data); setSetupMode(false);
      toast.success('Organization profile created!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  if (loading) return <div className="spinner-pink"/>;

  if (setupMode) return (
    <div className="page-container animate-in">
      <div style={{maxWidth:600,margin:'0 auto'}}>
        <div className="page-header">
          <h1 className="page-title">Setup Your Organization</h1>
          <p className="page-subtitle">Complete your organization profile to post jobs and courses</p>
        </div>
        <div className="card card-body">
          <form onSubmit={handleSetup}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Organization Name *</label>
                <input className="form-control" value={form.org_name} onChange={e=>upd('org_name',e.target.value)} required placeholder="e.g. Mahila Vikas Foundation"/>
              </div>
              <div className="form-group">
                <label className="form-label">Organization Type</label>
                <select className="form-control" value={form.org_type} onChange={e=>upd('org_type',e.target.value)}>
                  {['NGO','Foundation','Government','Private Company','Social Enterprise','Trust','Other'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input className="form-control" value={form.registration_number} onChange={e=>upd('registration_number',e.target.value)} placeholder="NGO/Trust/Company reg. no."/>
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-control" value={form.state} onChange={e=>upd('state',e.target.value)} placeholder="e.g. Maharashtra"/>
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input className="form-control" value={form.district} onChange={e=>upd('district',e.target.value)} placeholder="e.g. Pune"/>
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Contact Person</label>
                <input className="form-control" value={form.contact_person} onChange={e=>upd('contact_person',e.target.value)} placeholder="Name of representative"/>
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-control" value={form.website} onChange={e=>upd('website',e.target.value)} placeholder="https://yourorg.org"/>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-control" value={form.address} onChange={e=>upd('address',e.target.value)} placeholder="Full address"/>
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">About Your Organization</label>
                <textarea className="form-control" value={form.description} onChange={e=>upd('description',e.target.value)} rows={3} placeholder="Describe your organization's mission and work..."/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%'}} disabled={saving}>
              {saving?<><span className="spinner"/>Saving...</>:'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container animate-in">
      <div style={{background:'linear-gradient(135deg,var(--pink-600),var(--pink-800))',borderRadius:'var(--radius-xl)',padding:28,marginBottom:24,color:'white',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <Building2 size={18}/>
            <span style={{fontSize:13,opacity:0.8}}>{org?.org_type}</span>
          </div>
          <h1 style={{color:'white',fontSize:24}}>{org?.org_name}</h1>
          <p style={{opacity:0.75,fontSize:14}}>{org?.district && `${org.district}, `}{org?.state}</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <Link to="/org/jobs" className="btn" style={{background:'rgba(255,255,255,0.2)',color:'white',border:'1.5px solid rgba(255,255,255,0.4)'}}>
            <Plus size={14}/> Post Job
          </Link>
          <Link to="/org/courses" className="btn" style={{background:'rgba(255,255,255,0.2)',color:'white',border:'1.5px solid rgba(255,255,255,0.4)'}}>
            <Plus size={14}/> Add Course
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        {[
          { icon: Briefcase, label:'Active Jobs', value: stats.active_jobs, color:'#fce7f3', iconColor:'var(--pink-600)' },
          { icon: BookOpen, label:'Active Courses', value: stats.active_courses, color:'#f3e8ff', iconColor:'var(--purple-500)' },
          { icon: Users, label:'Total Applications', value: stats.total_applications, color:'#ccfbf1', iconColor:'var(--teal-500)' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{background:s.color}}><s.icon size={22} color={s.iconColor}/></div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div className="card card-body">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <h3 style={{fontSize:18}}>Quick Actions</h3>
          </div>
          {[
            { to:'/org/jobs', icon:Briefcase, label:'Manage Jobs', desc:'Post and manage job listings' },
            { to:'/org/courses', icon:BookOpen, label:'Manage Courses', desc:'Create training courses' },
          ].map(item=>(
            <Link key={item.to} to={item.to} style={{textDecoration:'none',display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid var(--pink-50)'}}>
              <div style={{width:40,height:40,borderRadius:10,background:'var(--pink-50)',display:'flex',alignItems:'center',justifyContent:'center'}}><item.icon size={18} color="var(--pink-600)"/></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:'var(--gray-800)'}}>{item.label}</div>
                <div style={{fontSize:12,color:'var(--gray-400)'}}>{item.desc}</div>
              </div>
              <ChevronRight size={16} color="var(--gray-400)"/>
            </Link>
          ))}
        </div>

        <div className="card card-body">
          <h3 style={{fontSize:18,marginBottom:14}}>Organization Info</h3>
          {[['Contact', org?.contact_person],['Website', org?.website],['Address', org?.address],['Registration', org?.registration_number]].map(([k,v])=>v&&(
            <div key={k} style={{padding:'8px 0',borderBottom:'1px solid var(--pink-50)'}}>
              <div style={{fontSize:11,color:'var(--gray-400)',textTransform:'uppercase',letterSpacing:0.5}}>{k}</div>
              <div style={{fontSize:13,color:'var(--gray-700)',marginTop:2}}>{v}</div>
            </div>
          ))}
          {org?.description && (
            <div style={{padding:'8px 0'}}>
              <div style={{fontSize:11,color:'var(--gray-400)',textTransform:'uppercase',letterSpacing:0.5}}>About</div>
              <div style={{fontSize:13,color:'var(--gray-600)',marginTop:2,lineHeight:1.5}}>{org.description}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
