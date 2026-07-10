import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Monitor, MapPin, Award, Sparkles, TrendingUp } from 'lucide-react';
import { coursesAPI, recommendationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

const CATS  = ['All','Digital Literacy','Tailoring','Agriculture','Healthcare','Finance','IT','Handicrafts','Education','Other'];
const MODES = ['All','online','offline','hybrid'];
const STATES= ['All','Andhra Pradesh','Bihar','Gujarat','Karnataka','Maharashtra','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function CoursesPage() {
  const { user }  = useAuth();
  const [courses, setCourses]       = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [recCourses, setRecCourses] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [activeTab, setActiveTab]   = useState('all');
  const [filters, setFilters]       = useState({ search:'', state:'', mode:'', category:'', is_free:'', page:1 });

  // Load AI recommendations
  useEffect(() => {
    if (user) {
      setRecLoading(true);
      recommendationsAPI.getCourses(8)
        .then(r => setRecCourses(r.data.data || []))
        .catch(() => {})
        .finally(() => setRecLoading(false));
    }
  }, [user]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search)                              params.search   = filters.search;
      if (filters.state    && filters.state    !== 'All') params.state    = filters.state;
      if (filters.mode     && filters.mode     !== 'All') params.mode     = filters.mode;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.is_free)                             params.is_free  = filters.is_free;
      params.page = filters.page; params.limit = 12;
      const res = await coursesAPI.getAll(params);
      setCourses(res.data.data); setTotal(res.data.total);
    } catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleCourseView = (id) => {
    if (user) recommendationsAPI.recordFeedback(id, 'course', 'view').catch(()=>{});
  };

  const upd = (k, v) => setFilters(p => ({ ...p, [k]: v, page: 1 }));

  const displayedCourses = activeTab === 'recommended' ? recCourses : courses;

  return (
    <div className="page-container animate-in">
      <div className="page-header">
        <h1 className="page-title">Training Courses</h1>
        <p className="page-subtitle">{total} courses available — many are free with certificates</p>
      </div>

      {/* AI Recommended Banner */}
      {user && recCourses.length > 0 && (
        <div style={{background:'linear-gradient(135deg,#f5f3ff,#fdf2f8)',border:'1.5px solid #e9d5ff',borderRadius:'var(--radius-lg)',padding:'14px 18px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#a855f7,#db2777)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Sparkles size={16} color="white"/>
            </div>
            <div>
              <div style={{fontWeight:600,fontSize:14,color:'#581c87'}}>
                {recCourses.length} courses matched to your learning goals
              </div>
              <div style={{fontSize:12,color:'#7c3aed',marginTop:1}}>
                Based on your interests, skills, and preferred language
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
              All Courses
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      {activeTab === 'all' && (
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input className="search-input" placeholder="Search courses, skills..."
              value={filters.search} onChange={e => upd('search', e.target.value)} />
          </div>
          <select className="form-control" style={{width:'auto'}} value={filters.category} onChange={e=>upd('category',e.target.value)}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="form-control" style={{width:'auto'}} value={filters.mode} onChange={e=>upd('mode',e.target.value)}>
            {MODES.map(m => <option key={m} style={{textTransform:'capitalize'}}>{m}</option>)}
          </select>
          <select className="form-control" style={{width:'auto'}} value={filters.state} onChange={e=>upd('state',e.target.value)}>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button
            className={`btn btn-sm ${filters.is_free==='true' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => upd('is_free', filters.is_free==='true' ? '' : 'true')}>
            Free Only
          </button>
        </div>
      )}

      {/* Recommended tab header */}
      {activeTab === 'recommended' && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <TrendingUp size={18} color="#7c3aed"/>
            <span style={{fontWeight:600,fontSize:16,color:'#581c87'}}>
              AI-Matched Courses for You
            </span>
            <span style={{fontSize:12,color:'var(--gray-400)',background:'#f3e8ff',padding:'2px 8px',borderRadius:999}}>
              Sorted by relevance
            </span>
          </div>
          <button onClick={() => setActiveTab('all')} className="btn btn-ghost btn-sm">
            View All Courses →
          </button>
        </div>
      )}

      {(activeTab === 'all' ? loading : recLoading) ? (
        <div className="spinner-pink"/>
      ) : displayedCourses.length === 0 ? (
        activeTab === 'recommended' ? (
          <div className="card card-body" style={{textAlign:'center',padding:40}}>
            <BookOpen size={40} color="var(--pink-300)" style={{marginBottom:12}}/>
            <h3 style={{fontFamily:'var(--font-body)',fontSize:18,color:'var(--gray-600)'}}>
              Tell us your interests for personalized course suggestions
            </h3>
            <p style={{fontSize:14,color:'var(--gray-400)',marginTop:8,marginBottom:16}}>
              Add your interests and preferred language in your profile.
            </p>
            <Link to="/profile" className="btn btn-primary">Update Profile</Link>
          </div>
        ) : (
          <EmptyState title="No courses found" desc="Try different filters." />
        )
      ) : (
        <>
          <div className="grid grid-3">
            {displayedCourses.map(c => (
              <Link key={c.id} to={`/courses/${c.id}`} style={{textDecoration:'none'}}
                onClick={() => handleCourseView(c.id)}>
                <div className="card opportunity-card" style={{height:'100%'}}>
                  {/* Top accent bar — gradient changes based on score */}
                  <div style={{height:6,
                    background: c.score >= 60
                      ? 'linear-gradient(90deg,#a855f7,#db2777)'
                      : 'linear-gradient(90deg,var(--pink-300),var(--purple-400))',
                    borderRadius:'var(--radius-lg) var(--radius-lg) 0 0'}}/>
                  <div className="card-body">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                      <span className="badge badge-pink">{c.category || 'General'}</span>
                      <div style={{display:'flex',gap:4}}>
                        {c.is_free && <span className="badge badge-green">Free</span>}
                        {c.certification && <span className="badge badge-purple"><Award size={10}/> Cert</span>}
                      </div>
                    </div>
                    <h3 className="opp-title">{c.title}</h3>
                    <p className="opp-org">{c.org_name}</p>
                    <p style={{fontSize:13,color:'var(--gray-500)',marginTop:8,lineHeight:1.5,
                      display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                      {c.description}
                    </p>

                    {/* AI match reason */}
                    {c.match_reason && c.score >= 30 && (
                      <div style={{display:'flex',alignItems:'center',gap:5,marginTop:8,
                        background:'#f5f3ff',borderRadius:8,padding:'4px 10px',width:'fit-content'}}>
                        <Sparkles size={11} color="#7c3aed"/>
                        <span style={{fontSize:11,color:'#7c3aed',fontWeight:500}}>
                          {c.match_reason}
                        </span>
                      </div>
                    )}

                    <div className="opp-meta" style={{marginTop:10}}>
                      {c.duration && <span className="opp-meta-item"><Clock size={12}/>{c.duration}</span>}
                      {c.mode     && <span className="opp-meta-item"><Monitor size={12}/>{c.mode}</span>}
                      {c.location_district && <span className="opp-meta-item"><MapPin size={12}/>{c.location_district}</span>}
                    </div>

                    <div className="opp-footer">
                      <div style={{display:'flex',gap:4,alignItems:'center',flexWrap:'wrap'}}>
                        {c.language?.length > 0 && (
                          <span style={{fontSize:11,color:'var(--gray-400)'}}>
                            In: {c.language.slice(0,2).join(', ')}
                          </span>
                        )}
                        {/* Match % for recommended tab */}
                        {activeTab === 'recommended' && c.score > 0 && (
                          <span style={{fontSize:11,background:'#f5f3ff',color:'#7c3aed',
                            padding:'2px 8px',borderRadius:999,fontWeight:600}}>
                            {c.score}% match
                          </span>
                        )}
                      </div>
                      {c.seats && <span style={{fontSize:11,color:'var(--gray-400)'}}>{c.seats} seats</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
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
