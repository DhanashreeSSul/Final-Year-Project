import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Monitor, MapPin, Calendar, Users, Award, ChevronLeft, Send, CheckCircle } from 'lucide-react';
import { coursesAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    coursesAPI.getOne(id).then(r=>setCourse(r.data.data)).catch(()=>toast.error('Course not found')).finally(()=>setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      await applicationsAPI.apply({ entity_id: id, entity_type: 'course' });
      setEnrolled(true);
      toast.success('Enrolled successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to enroll'); }
    finally { setApplying(false); }
  };

  if (loading) return <div className="spinner-pink"/>;
  if (!course) return <div className="page-container"><h2>Course not found</h2><Link to="/courses">Back</Link></div>;

  return (
    <div className="page-container animate-in">
      <Link to="/courses" className="btn btn-ghost btn-sm" style={{marginBottom:16}}><ChevronLeft size={16}/> Back to Courses</Link>
      <div style={{height:8,background:'linear-gradient(90deg,var(--pink-400),var(--purple-500))',borderRadius:'var(--radius-lg) var(--radius-lg) 0 0'}} />
      <div className="detail-header" style={{borderRadius:'0 0 var(--radius-lg) var(--radius-lg)',marginTop:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
          <div>
            <div style={{display:'flex',gap:8,marginBottom:8}}>
              {course.category && <span className="badge badge-pink">{course.category}</span>}
              {course.is_free && <span className="badge badge-green">Free</span>}
              {course.certification && <span className="badge badge-purple"><Award size={10}/> Certificate</span>}
              {course.mode && <span className="badge badge-teal" style={{textTransform:'capitalize'}}>{course.mode}</span>}
            </div>
            <h1 className="detail-title">{course.title}</h1>
            <p style={{color:'var(--pink-600)',fontWeight:600,fontSize:16}}>{course.org_name}</p>
          </div>
          <div style={{textAlign:'right'}}>
            {course.is_free ? (
              <div style={{fontSize:28,fontWeight:700,color:'var(--green-600)',fontFamily:'var(--font-display)'}}>FREE</div>
            ) : (
              <div style={{fontSize:22,fontWeight:700,color:'var(--pink-700)',fontFamily:'var(--font-display)'}}>₹{course.fee?.toLocaleString()}</div>
            )}
            {course.duration && <div style={{fontSize:12,color:'var(--gray-400)',marginTop:2}}>{course.duration}</div>}
          </div>
        </div>
        <div style={{display:'flex',gap:16,marginTop:16,flexWrap:'wrap'}}>
          {course.mode && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><Monitor size={14}/>{course.mode}</span>}
          {course.location_district && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><MapPin size={14}/>{course.location_district}</span>}
          {course.start_date && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><Calendar size={14}/>Starts {new Date(course.start_date).toLocaleDateString('en-IN')}</span>}
          {course.seats && <span style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'var(--gray-500)'}}><Users size={14}/>{course.seats} seats</span>}
        </div>
        <div className="detail-actions">
          {enrolled ? (
            <span className="badge badge-green" style={{padding:'10px 20px',fontSize:14,display:'flex',alignItems:'center',gap:6}}>
              <CheckCircle size={16}/> Enrolled
            </span>
          ) : (
            <button className="btn btn-primary" onClick={handleEnroll} disabled={applying}>
              {applying ? <><span className="spinner"/>Enrolling...</> : <><Send size={16}/> Enroll Now</>}
            </button>
          )}
          <Link to="/chatbot" className="btn btn-secondary">Ask AI Guide</Link>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:20}}>
        <div className="card card-body">
          <h3 style={{fontSize:18,marginBottom:12}}>About this Course</h3>
          <p style={{fontSize:14,color:'var(--gray-600)',lineHeight:1.8,whiteSpace:'pre-line'}}>{course.description}</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {course.skills_taught?.length>0 && (
            <div className="card card-body">
              <h4 style={{fontSize:15,marginBottom:10}}>Skills You Will Learn</h4>
              <div className="tag-list">{course.skills_taught.map(s=><span key={s} className="tag">{s}</span>)}</div>
            </div>
          )}
          {course.language?.length>0 && (
            <div className="card card-body">
              <h4 style={{fontSize:15,marginBottom:10}}>Available Languages</h4>
              <div className="tag-list">{course.language.map(l=><span key={l} className="tag">{l}</span>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
