import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ExternalLink } from 'lucide-react';
import { schemesAPI } from '../utils/api';
import EmptyState from '../components/shared/EmptyState';
import toast from 'react-hot-toast';

const CATS = ['All','Women Empowerment','Agriculture','Education','Health','Housing','Finance','Self Employment','Social Security','Other'];
const STATES = ['All','Andhra Pradesh','Bihar','Gujarat','Karnataka','Maharashtra','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search:'', state:'', category:'', page:1 });

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.state && filters.state!=='All') params.state = filters.state;
      if (filters.category && filters.category!=='All') params.category = filters.category;
      params.page = filters.page; params.limit = 12;
      const res = await schemesAPI.getAll(params);
      setSchemes(res.data.data); setTotal(res.data.total);
    } catch { toast.error('Failed to load schemes'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchSchemes(); }, [fetchSchemes]);
  const upd = (k,v) => setFilters(p=>({...p,[k]:v,page:1}));

  const catColors = { 'Women Empowerment':'badge-pink', 'Agriculture':'badge-green', 'Education':'badge-purple', 'Health':'badge-teal', 'Finance':'badge-amber', 'Housing':'badge-pink' };

  return (
    <div className="page-container animate-in">
      <div className="page-header">
        <h1 className="page-title">Government Schemes</h1>
        <p className="page-subtitle">{total} schemes for women's welfare and empowerment</p>
      </div>
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon"/>
          <input className="search-input" placeholder="Search schemes, ministries..." value={filters.search} onChange={e=>upd('search',e.target.value)}/>
        </div>
        <select className="form-control" style={{width:'auto'}} value={filters.category} onChange={e=>upd('category',e.target.value)}>
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <select className="form-control" style={{width:'auto'}} value={filters.state} onChange={e=>upd('state',e.target.value)}>
          {STATES.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="spinner-pink"/> : schemes.length===0 ? <EmptyState title="No schemes found" desc="Try different search terms."/> : (
        <>
          <div className="grid grid-2">
            {schemes.map(s => (
              <Link key={s.id} to={`/schemes/${s.id}`} style={{textDecoration:'none'}}>
                <div className="card opportunity-card">
                  <div style={{height:5,background:'linear-gradient(90deg,#f97316,#db2777)',borderRadius:'var(--radius-lg) var(--radius-lg) 0 0'}}/>
                  <div className="card-body">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                      <span className={`badge ${catColors[s.category]||'badge-pink'}`}>{s.category||'Scheme'}</span>
                      <span className="badge badge-teal">{s.state==='All'?'All India':s.state}</span>
                    </div>
                    <h3 className="opp-title">{s.title}</h3>
                    {s.ministry && <p className="opp-org">{s.ministry}</p>}
                    <p style={{fontSize:13,color:'var(--gray-500)',marginTop:8,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{s.description}</p>
                    <div className="opp-footer" style={{marginTop:12}}>
                      <span style={{fontSize:12,color:'var(--pink-600)',fontWeight:500,display:'flex',alignItems:'center',gap:4}}>
                        <Heart size={12}/> View Details & How to Apply
                      </span>
                      {s.application_link && (
                        <a href={s.application_link} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="btn btn-ghost btn-sm">
                          <ExternalLink size={12}/> Apply
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {total>12 && (
            <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:24}}>
              <button className="btn btn-secondary btn-sm" onClick={()=>upd('page',Math.max(1,filters.page-1))} disabled={filters.page===1}>Previous</button>
              <span style={{padding:'8px 16px',fontSize:14,color:'var(--gray-600)'}}>Page {filters.page} of {Math.ceil(total/12)}</span>
              <button className="btn btn-secondary btn-sm" onClick={()=>upd('page',filters.page+1)} disabled={filters.page>=Math.ceil(total/12)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
