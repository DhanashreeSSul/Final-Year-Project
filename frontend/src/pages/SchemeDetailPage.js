import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, CheckCircle, FileText, Send } from 'lucide-react';
import { schemesAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SchemeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    schemesAPI.getOne(id).then(r=>setScheme(r.data.data)).catch(()=>toast.error('Scheme not found')).finally(()=>setLoading(false));
  }, [id]);

  const handleTrack = async () => {
    if (!user) return navigate('/login');
    setTracking(true);
    try {
      await applicationsAPI.apply({ entity_id: id, entity_type: 'scheme' });
      setTracked(true); toast.success('Scheme tracked! We will notify you of updates.');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setTracking(false); }
  };

  if (loading) return <div className="spinner-pink"/>;
  if (!scheme) return <div className="page-container"><h2>Scheme not found</h2><Link to="/schemes">Back</Link></div>;

  return (
    <div className="page-container animate-in">
      <Link to="/schemes" className="btn btn-ghost btn-sm" style={{marginBottom:16}}><ChevronLeft size={16}/> Back to Schemes</Link>
      <div style={{height:6,background:'linear-gradient(90deg,#f97316,#db2777)',borderRadius:'var(--radius-lg) var(--radius-lg) 0 0'}}/>
      <div className="detail-header" style={{borderRadius:'0 0 var(--radius-lg) var(--radius-lg)',marginTop:0}}>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          {scheme.category && <span className="badge badge-pink">{scheme.category}</span>}
          <span className="badge badge-teal">{scheme.state==='All'?'All India':scheme.state}</span>
        </div>
        <h1 className="detail-title">{scheme.title}</h1>
        {scheme.ministry && <p style={{color:'var(--pink-600)',fontWeight:600,fontSize:15,marginTop:4}}>{scheme.ministry}</p>}
        <div className="detail-actions">
          {tracked ? (
            <span className="badge badge-green" style={{padding:'10px 20px',fontSize:14,display:'flex',alignItems:'center',gap:6}}>
              <CheckCircle size={16}/> Tracking this Scheme
            </span>
          ) : (
            <button className="btn btn-primary" onClick={handleTrack} disabled={tracking}>
              {tracking?<><span className="spinner"/>Please wait...</>:<><Send size={14}/> Track this Scheme</>}
            </button>
          )}
          {scheme.application_link && (
            <a href={scheme.application_link} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <ExternalLink size={14}/> Official Apply Link
            </a>
          )}
          <Link to="/chatbot" className="btn btn-ghost">Ask AI Guide</Link>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:20}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="card card-body">
            <h3 style={{fontSize:18,marginBottom:12}}>About this Scheme</h3>
            <p style={{fontSize:14,color:'var(--gray-600)',lineHeight:1.8,whiteSpace:'pre-line'}}>{scheme.description}</p>
          </div>
          {scheme.benefits && (
            <div className="card card-body">
              <h3 style={{fontSize:18,marginBottom:12}}>Benefits</h3>
              <p style={{fontSize:14,color:'var(--gray-600)',lineHeight:1.8,whiteSpace:'pre-line'}}>{scheme.benefits}</p>
            </div>
          )}
          {scheme.how_to_apply && (
            <div className="card card-body">
              <h3 style={{fontSize:18,marginBottom:12}}>How to Apply</h3>
              <p style={{fontSize:14,color:'var(--gray-600)',lineHeight:1.8,whiteSpace:'pre-line'}}>{scheme.how_to_apply}</p>
            </div>
          )}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {scheme.eligibility_criteria && (
            <div className="card card-body">
              <h4 style={{fontSize:15,marginBottom:10,display:'flex',alignItems:'center',gap:6}}><CheckCircle size={15} color="var(--green-600)"/> Eligibility</h4>
              <p style={{fontSize:13,color:'var(--gray-600)',lineHeight:1.7,whiteSpace:'pre-line'}}>{scheme.eligibility_criteria}</p>
            </div>
          )}
          {scheme.documents_required?.length>0 && (
            <div className="card card-body">
              <h4 style={{fontSize:15,marginBottom:10,display:'flex',alignItems:'center',gap:6}}><FileText size={15} color="var(--pink-600)"/> Documents Required</h4>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:6}}>
                {scheme.documents_required.map(d=>(
                  <li key={d} style={{fontSize:13,color:'var(--gray-600)',display:'flex',alignItems:'center',gap:6}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:'var(--pink-400)',flexShrink:0}}/>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
