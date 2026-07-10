import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Briefcase, Bookmark, BookmarkCheck, Sparkles, TrendingUp } from 'lucide-react';
import { jobsAPI, usersAPI, recommendationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

const STATES = ['All','Andhra Pradesh','Bihar','Chhattisgarh','Gujarat','Jharkhand','Karnataka','Madhya Pradesh','Maharashtra','Odisha','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];
const MODES  = ['All','remote','onsite','hybrid'];
const CATS   = ['All','Agriculture','Handicrafts','Healthcare','Education','IT','Tailoring','Retail','Finance','Social Work','Other'];

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [recJobs, setRecJobs]     = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'recommended'
  const [filters, setFilters]     = useState({ search:'', state:'', work_mode:'', category:'', page:1 });

  // Load AI recommendations when user is logged in
  useEffect(() => {
    if (user) {
      setRecLoading(true);
      recommendationsAPI.getJobs(8)
        .then(r => setRecJobs(r.data.data || []))
        .catch(() => {})
        .finally(() => setRecLoading(false));
    }
  }, [user]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search)                            params.search    = filters.search;
      if (filters.state    && filters.state    !== 'All') params.state     = filters.state;
      if (filters.work_mode && filters.work_mode !== 'All') params.work_mode = filters.work_mode;
      if (filters.category && filters.category !== 'All') params.category  = filters.category;
      params.page = filters.page; params.limit = 12;
      const res = await jobsAPI.getAll(params);
      setJobs(res.data.data); setTotal(res.data.total);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (user) {
      usersAPI.getBookmarks()
        .then(r => setBookmarks(new Set(r.data.data.filter(b=>b.entity_type==='job').map(b=>b.entity_id))))
        .catch(()=>{});
    }
  }, [user]);

  const toggleBookmark = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return toast.error('Please login to save jobs');
    try {
      const res = await usersAPI.bookmarkToggle({ entity_id: id, entity_type: 'job' });
      setBookmarks(prev => { const n = new Set(prev); res.data.bookmarked ? n.add(id) : n.delete(id); return n; });
      toast.success(res.data.bookmarked ? 'Job saved!' : 'Removed from saved');
    } catch { toast.error('Failed'); }
  };

  const handleJobClick = (id) => {
    // Record view feedback silently
    if (user) recommendationsAPI.recordFeedback(id, 'job', 'view').catch(()=>{});
  };

  const upd = (k, v) => setFilters(p => ({ ...p, [k]: v, page: 1 }));

  const displayedJobs = activeTab === 'recommended' ? recJobs : jobs;

  return (
    <div className="page-container animate-in">
      <div className="page-header">
        <h1 className="page-title">Find Jobs</h1>
        <p className="page-subtitle">{total} opportunities available across India</p>
      </div>

      {/* AI Recommended Banner — shown only when logged in and recs exist */}
      {user && recJobs.length > 0 && (
        <div style={{background:'linear-gradient(135deg,#fdf2f8,#fff0f9)',border:'1.5px solid var(--pink-200)',borderRadius:'var(--radius-lg)',padding:'14px 18px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,var(--pink-500),var(--pink-700))',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Sparkles size={16} color="white"/>
            </div>
            <div>
              <div style={{fontWeight:600,fontSize:14,color:'var(--pink-800)'}}>
                {recJobs.length} jobs matched to your profile
              </div>
              <div style={{fontSize:12,color:'var(--pink-600)',marginTop:1}}>
                Based on your skills, interests, and location
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:6}}>
            <button
              onClick={() => setActiveTab('recommended')}
              className={`btn btn-sm ${activeTab==='recommended' ? 'btn-primary' : 'btn-secondary'}`}>
              <Sparkles size={13}/> Recommended
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab==='all' ? 'btn-primary' : 'btn-secondary'}`}>
              All Jobs
            </button>
          </div>
        </div>
      )}

      {/* Filters — shown only in All tab */}
      {activeTab === 'all' && (
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input className="search-input" placeholder="Search jobs, skills, organizations..."
              value={filters.search} onChange={e => upd('search', e.target.value)} />
          </div>
          <select className="form-control" style={{width:'auto'}} value={filters.state} onChange={e=>upd('state',e.target.value)}>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="form-control" style={{width:'auto'}} value={filters.work_mode} onChange={e=>upd('work_mode',e.target.value)}>
            {MODES.map(m => <option key={m} style={{textTransform:'capitalize'}}>{m}</option>)}
          </select>
          <select className="form-control" style={{width:'auto'}} value={filters.category} onChange={e=>upd('category',e.target.value)}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      )}

      {/* Recommended tab header */}
      {activeTab === 'recommended' && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <TrendingUp size={18} color="var(--pink-600)"/>
            <span style={{fontWeight:600,fontSize:16,color:'var(--pink-800)'}}>
              AI-Matched Jobs for You
            </span>
            <span style={{fontSize:12,color:'var(--gray-400)',background:'var(--pink-50)',padding:'2px 8px',borderRadius:999}}>
              Sorted by match score
            </span>
          </div>
          <button onClick={() => setActiveTab('all')} className="btn btn-ghost btn-sm">
            View All Jobs →
          </button>
        </div>
      )}

      {/* Loading state */}
      {(activeTab === 'all' ? loading : recLoading) ? (
        <div className="spinner-pink" />
      ) : displayedJobs.length === 0 ? (
        activeTab === 'recommended' ? (
          <div className="card card-body" style={{textAlign:'center',padding:40}}>
            <Sparkles size={40} color="var(--pink-300)" style={{marginBottom:12}}/>
            <h3 style={{fontFamily:'var(--font-body)',fontSize:18,color:'var(--gray-600)'}}>
              Complete your profile for personalized recommendations
            </h3>
            <p style={{fontSize:14,color:'var(--gray-400)',marginTop:8,marginBottom:16}}>
              Add your skills, interests, and location to get AI-matched jobs.
            </p>
            <Link to="/profile" className="btn btn-primary">Update Profile</Link>
          </div>
        ) : (
          <EmptyState title="No jobs found" desc="Try changing your filters or search terms." />
        )
      ) : (
        <>
          <div className="grid grid-2">
            {displayedJobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} style={{textDecoration:'none'}}
                onClick={() => handleJobClick(job.id)}>
                <div className="card opportunity-card">
                  <div className="card-body">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <h3 className="opp-title">{job.title}</h3>
                        <p className="opp-org">{job.org_name}</p>
                      </div>
                      <button onClick={e => toggleBookmark(e, job.id)}
                        style={{background:'none',border:'none',cursor:'pointer',color:'var(--pink-400)',flexShrink:0,padding:4}}>
                        {bookmarks.has(job.id)
                          ? <BookmarkCheck size={18} color="var(--pink-600)"/>
                          : <Bookmark size={18}/>}
                      </button>
                    </div>

                    <p style={{fontSize:13,color:'var(--gray-500)',marginTop:8,lineHeight:1.5,
                      display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                      {job.description}
                    </p>

                    {/* AI match reason badge */}
                    {job.match_reason && job.score >= 30 && (
                      <div style={{display:'flex',alignItems:'center',gap:5,marginTop:8,
                        background:'var(--pink-50)',borderRadius:8,padding:'4px 10px',width:'fit-content'}}>
                        <Sparkles size={11} color="var(--pink-500)"/>
                        <span style={{fontSize:11,color:'var(--pink-700)',fontWeight:500}}>
                          {job.match_reason}
                        </span>
                      </div>
                    )}

                    <div className="opp-meta">
                      {job.location_district && (
                        <span className="opp-meta-item">
                          <MapPin size={12}/>{job.location_district}, {job.location_state}
                        </span>
                      )}
                      {job.work_mode && (
                        <span className="opp-meta-item">
                          <Briefcase size={12}/>{job.work_mode}
                        </span>
                      )}
                      {job.job_type && (
                        <span className="opp-meta-item">
                          <Clock size={12}/>{job.job_type}
                        </span>
                      )}
                    </div>

                    <div className="opp-footer">
                      <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                        {job.category && <span className="badge badge-pink">{job.category}</span>}
                        {job.salary_min && (
                          <span className="badge badge-green">
                            ₹{job.salary_min.toLocaleString()}+/mo
                          </span>
                        )}
                        {/* Match score pill for recommended tab */}
                        {activeTab === 'recommended' && job.score > 0 && (
                          <span style={{fontSize:11,background:'#f0fdf4',color:'var(--green-600)',
                            padding:'2px 8px',borderRadius:999,fontWeight:600}}>
                            {job.score}% match
                          </span>
                        )}
                      </div>
                      {job.application_deadline && (
                        <span style={{fontSize:11,color:'var(--gray-400)'}}>
                          Apply by {new Date(job.application_deadline).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination — only for All Jobs tab */}
          {activeTab === 'all' && total > 12 && (
            <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:24}}>
              <button className="btn btn-secondary btn-sm"
                onClick={() => upd('page', Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}>Previous</button>
              <span style={{padding:'8px 16px',fontSize:14,color:'var(--gray-600)'}}>
                Page {filters.page} of {Math.ceil(total / 12)}
              </span>
              <button className="btn btn-secondary btn-sm"
                onClick={() => upd('page', filters.page + 1)}
                disabled={filters.page >= Math.ceil(total / 12)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
