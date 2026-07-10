import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, Heart, MessageCircle, TrendingUp, Star, Bell, ChevronRight, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { recommendationsAPI, usersAPI } from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [recs, setRecs]     = useState({ jobs:[], courses:[], schemes:[], profile_completeness:0, profile_tips:[], has_profile:false });
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      recommendationsAPI.get().then(r => setRecs(r.data.data)),
      usersAPI.getNotifications().then(r => setNotifs(r.data.data.slice(0,5))),
    ]).finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to:'/jobs',    icon:Briefcase,     label:'Find Jobs',    color:'#db2777', bg:'#fce7f3', count:recs.jobs?.length },
    { to:'/courses', icon:BookOpen,      label:'Courses',      color:'#7c3aed', bg:'#f3e8ff', count:recs.courses?.length },
    { to:'/schemes', icon:Heart,         label:'Schemes',      color:'#0f766e', bg:'#ccfbf1', count:recs.schemes?.length },
    { to:'/chatbot', icon:MessageCircle, label:'AI Guide',     color:'#b45309', bg:'#fef3c7', count:null },
  ];

  return (
    <div className="page-container animate-in">
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,var(--pink-600),var(--pink-800))',borderRadius:'var(--radius-xl)',padding:28,marginBottom:24,color:'white'}}>
        <p style={{opacity:0.8,fontSize:13,marginBottom:4}}>Welcome back,</p>
        <h1 style={{color:'white',fontSize:26,marginBottom:4}}>{user?.name}</h1>
        <p style={{opacity:0.75,fontSize:14}}>
          {user?.state && user?.district ? `${user.district}, ${user.state}` : 'Complete your profile to get better recommendations'}
        </p>
        {recs.profile_completeness < 100 && (
          <div style={{marginTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:12,opacity:0.9}}>
              <span>Profile Completeness</span><span>{recs.profile_completeness}%</span>
            </div>
            <div className="progress-bar" style={{background:'rgba(255,255,255,0.2)'}}>
              <div className="progress-fill" style={{width:`${recs.profile_completeness}%`,background:'rgba(255,255,255,0.8)'}}/>
            </div>
            <Link to="/profile" style={{marginTop:8,display:'inline-block',fontSize:12,color:'rgba(255,255,255,0.9)',fontWeight:600}}>
              Complete Profile →
            </Link>
          </div>
        )}
      </div>

      {/* Profile tips */}
      {recs.profile_tips?.length > 0 && (
        <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'var(--radius-lg)',padding:'12px 16px',marginBottom:16,display:'flex',gap:10,alignItems:'center'}}>
          <AlertCircle size={16} color="#d97706"/>
          <p style={{fontSize:13,color:'#92400e'}}>
            {recs.profile_tips[0]} — <Link to="/profile" style={{color:'#b45309',fontWeight:600}}>Update Profile</Link>
          </p>
        </div>
      )}

      {/* Quick Links */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
        {quickLinks.map(q => (
          <Link key={q.to} to={q.to} style={{textDecoration:'none'}}>
            <div style={{background:'white',borderRadius:'var(--radius-lg)',padding:16,border:'1px solid var(--pink-100)',textAlign:'center',transition:'all 0.2s',cursor:'pointer'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{width:44,height:44,borderRadius:12,background:q.bg,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}>
                <q.icon size={20} color={q.color}/>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:'var(--gray-700)'}}>{q.label}</div>
              {q.count !== null && (
                <div style={{fontSize:11,color:'var(--pink-500)',marginTop:2,fontWeight:500}}>
                  {q.count > 0 ? `${q.count} for you` : 'Explore'}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24}}>
        <div>
          {/* Recommended Jobs */}
          {recs.jobs?.length > 0 && (
            <div style={{marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Sparkles size={16} color="var(--pink-600)"/>
                  <h3 style={{fontSize:18}}>Jobs Matched for You</h3>
                </div>
                <Link to="/jobs" className="btn btn-ghost btn-sm">View All <ChevronRight size={14}/></Link>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {recs.jobs.slice(0,3).map(job => (
                  <Link key={job.id} to={`/jobs/${job.id}`} style={{textDecoration:'none'}}
                    onClick={()=>recommendationsAPI.recordFeedback(job.id,'job','view').catch(()=>{})}>
                    <div className="card card-body" style={{padding:16}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,color:'var(--gray-800)',fontSize:15}}>{job.title}</div>
                          <div style={{fontSize:13,color:'var(--pink-600)',marginTop:2}}>{job.org_name}</div>
                          <div style={{display:'flex',gap:10,marginTop:8,fontSize:12,color:'var(--gray-400)'}}>
                            {job.location_district && <span style={{display:'flex',alignItems:'center',gap:3}}><MapPin size={11}/>{job.location_district}</span>}
                            {job.work_mode && <span style={{textTransform:'capitalize'}}>{job.work_mode}</span>}
                          </div>
                          {job.match_reason && (
                            <div style={{display:'flex',alignItems:'center',gap:4,marginTop:7,
                              background:'var(--pink-50)',borderRadius:6,padding:'3px 8px',width:'fit-content'}}>
                              <Sparkles size={10} color="var(--pink-500)"/>
                              <span style={{fontSize:11,color:'var(--pink-700)'}}>{job.match_reason}</span>
                            </div>
                          )}
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                          <span className="badge badge-pink" style={{flexShrink:0}}>{job.category||'General'}</span>
                          {job.score > 0 && (
                            <span style={{fontSize:11,background:'#f0fdf4',color:'var(--green-600)',padding:'2px 8px',borderRadius:999,fontWeight:600}}>
                              {job.score}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Courses */}
          {recs.courses?.length > 0 && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <Sparkles size={16} color="#7c3aed"/>
                  <h3 style={{fontSize:18}}>Courses for Your Growth</h3>
                </div>
                <Link to="/courses" className="btn btn-ghost btn-sm">View All <ChevronRight size={14}/></Link>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {recs.courses.slice(0,3).map(c => (
                  <Link key={c.id} to={`/courses/${c.id}`} style={{textDecoration:'none'}}
                    onClick={()=>recommendationsAPI.recordFeedback(c.id,'course','view').catch(()=>{})}>
                    <div className="card card-body" style={{padding:16}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,color:'var(--gray-800)',fontSize:15}}>{c.title}</div>
                          <div style={{fontSize:13,color:'var(--pink-600)',marginTop:2}}>{c.org_name}</div>
                          <div style={{display:'flex',gap:6,marginTop:8}}>
                            {c.is_free && <span className="badge badge-green">Free</span>}
                            {c.certification && <span className="badge badge-purple">Certificate</span>}
                            {c.mode && <span className="badge badge-teal" style={{textTransform:'capitalize'}}>{c.mode}</span>}
                          </div>
                          {c.match_reason && (
                            <div style={{display:'flex',alignItems:'center',gap:4,marginTop:7,
                              background:'#f5f3ff',borderRadius:6,padding:'3px 8px',width:'fit-content'}}>
                              <Sparkles size={10} color="#7c3aed"/>
                              <span style={{fontSize:11,color:'#7c3aed'}}>{c.match_reason}</span>
                            </div>
                          )}
                        </div>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                          <span className="badge badge-amber">{c.duration||'Flexible'}</span>
                          {c.score > 0 && (
                            <span style={{fontSize:11,background:'#f5f3ff',color:'#7c3aed',padding:'2px 8px',borderRadius:999,fontWeight:600}}>
                              {c.score}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when no recs */}
          {!loading && recs.jobs?.length === 0 && recs.courses?.length === 0 && (
            <div className="card card-body" style={{textAlign:'center',padding:40}}>
              <TrendingUp size={40} color="var(--pink-300)" style={{marginBottom:12}}/>
              <h3 style={{fontFamily:'var(--font-body)',fontSize:18,color:'var(--gray-700)'}}>Complete Your Profile</h3>
              <p style={{fontSize:14,color:'var(--gray-500)',marginTop:8,marginBottom:16}}>
                Add your skills, interests, and location to get AI-personalized job and course recommendations.
              </p>
              <Link to="/profile" className="btn btn-primary">Update Profile</Link>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div>
          {/* Notifications */}
          <div className="card card-body" style={{marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <Bell size={16} color="var(--pink-600)"/>
              <h3 style={{fontSize:16}}>Notifications</h3>
            </div>
            {notifs.length > 0 ? notifs.map(n => (
              <div key={n.id} style={{padding:'10px 0',borderBottom:'1px solid var(--pink-50)',display:'flex',gap:8,alignItems:'flex-start'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:n.is_read?'var(--gray-300)':'var(--pink-500)',marginTop:5,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--gray-700)'}}>{n.title}</div>
                  <div style={{fontSize:12,color:'var(--gray-400)',marginTop:2}}>{n.message}</div>
                </div>
              </div>
            )) : (
              <p style={{fontSize:13,color:'var(--gray-400)',textAlign:'center',padding:'12px 0'}}>No notifications yet</p>
            )}
          </div>

          {/* Govt Schemes */}
          {recs.schemes?.length > 0 && (
            <div className="card card-body">
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <Star size={16} color="var(--pink-600)"/>
                <h3 style={{fontSize:16}}>Govt. Schemes For You</h3>
              </div>
              {recs.schemes.slice(0,3).map(s => (
                <Link key={s.id} to={`/schemes/${s.id}`} style={{textDecoration:'none',display:'block',padding:'10px 0',borderBottom:'1px solid var(--pink-50)'}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--gray-700)'}}>{s.title}</div>
                  <div style={{fontSize:12,color:'var(--gray-400)',marginTop:2}}>{s.ministry}</div>
                </Link>
              ))}
              <Link to="/schemes" className="btn btn-ghost btn-sm" style={{marginTop:8,width:'100%'}}>View All Schemes</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
