import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, Heart, Clock } from 'lucide-react';
import { applicationsAPI } from '../utils/api';

const statusColors = { applied:'#fef3c7|#92400e', shortlisted:'#f3e8ff|#7c3aed', selected:'#dcfce7|#16a34a', rejected:'#fce7f3|#be185d', enrolled:'#ccfbf1|#0f766e' };
const typeIcons = { job: Briefcase, course: BookOpen, scheme: Heart };

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    applicationsAPI.getMy().then(r=>setApps(r.data.data)).finally(()=>setLoading(false));
  }, []);

  const filtered = tab === 'all' ? apps : apps.filter(a=>a.entity_type===tab);

  return (
    <div className="page-container animate-in">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track all your job, course, and scheme applications</p>
      </div>
      <div className="tabs">
        {['all','job','course','scheme'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`tab-btn ${tab===t?'active':''}`} style={{textTransform:'capitalize'}}>{t==='all'?'All Applications':t+'s'}</button>
        ))}
      </div>
      {loading ? <div className="spinner-pink"/> : filtered.length===0 ? (
        <div className="card card-body" style={{textAlign:'center',padding:48}}>
          <p style={{color:'var(--gray-400)'}}>No applications found. Start browsing to apply.</p>
          <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:16}}>
            <Link to="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link>
            <Link to="/courses" className="btn btn-secondary btn-sm">Find Courses</Link>
          </div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {filtered.map(a => {
            const Icon = typeIcons[a.entity_type] || Briefcase;
            const [bg, txt] = (statusColors[a.status]||'#fce7f3|#be185d').split('|');
            return (
              <div key={a.id} className="card card-body" style={{display:'flex',alignItems:'center',gap:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:'var(--pink-50)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon size={20} color="var(--pink-600)"/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,color:'var(--gray-800)',fontSize:15}}>{a.entity_title||'Untitled'}</div>
                  <div style={{fontSize:12,color:'var(--gray-400)',marginTop:3,display:'flex',gap:10,alignItems:'center'}}>
                    <span style={{textTransform:'capitalize'}}>{a.entity_type}</span>
                    <span style={{display:'flex',alignItems:'center',gap:3}}><Clock size={11}/> {new Date(a.applied_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <span style={{padding:'4px 12px',borderRadius:999,fontSize:12,fontWeight:600,background:bg,color:txt,textTransform:'capitalize',flexShrink:0}}>
                  {a.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
