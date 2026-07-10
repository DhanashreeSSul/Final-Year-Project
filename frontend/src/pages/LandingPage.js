import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Globe, Cpu, MapPin, Users, BookOpen, Briefcase, Heart, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { analyticsAPI } from '../utils/api';

export default function LandingPage() {
  const [stats, setStats] = useState({ total_women: 0, active_jobs: 0, active_courses: 0, active_schemes: 0 });

  useEffect(() => {
    analyticsAPI.getStats().then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const features = [
    { icon: Shield, color: '#db2777', bg: '#fce7f3', title: 'Privacy-First Security', desc: 'OTP-based registration, JWT auth, encrypted data, and consent-driven privacy.' },
    { icon: Globe, color: '#7c3aed', bg: '#f3e8ff', title: 'Multilingual Support', desc: 'Chat and browse in Hindi, Marathi, Telugu, Tamil, Kannada and more.' },
    { icon: Cpu, color: '#0f766e', bg: '#ccfbf1', title: 'AI Career Recommender', desc: 'Smart matching of your skills and interests to real jobs, courses, and schemes.' },
    { icon: MapPin, color: '#b45309', bg: '#fef3c7', title: 'Hyperlocal Opportunities', desc: 'Find opportunities near your village, district, or work remotely.' },
    { icon: BookOpen, color: '#1d4ed8', bg: '#dbeafe', title: 'Free Training Courses', desc: 'Certified skill-development programs from trusted NGOs and foundations.' },
    { icon: Heart, color: '#be185d', bg: '#fce7f3', title: 'Government Schemes', desc: 'Discover PM Mudra, PMAY, and 50+ schemes designed for rural women.' },
  ];

  const steps = [
    { num: '01', title: 'Register Securely', desc: 'Sign up with OTP verification — no Aadhaar required, privacy protected.' },
    { num: '02', title: 'Build Your Profile', desc: 'Share your skills, interests, and location to get personalized recommendations.' },
    { num: '03', title: 'Explore Opportunities', desc: 'Browse jobs, courses, and schemes — or let our AI guide suggest the best fit.' },
    { num: '04', title: 'Apply & Grow', desc: 'Apply in one tap, track applications, and build your career journey.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.15)',borderRadius:999,padding:'6px 16px',marginBottom:20,fontSize:13,color:'rgba(255,255,255,0.9)'}}>
            <Sparkles size={14} /> AI-Powered Platform for Rural Women
          </div>
          <h1>Shakti — Empowering Rural Women Through Digital Literacy</h1>
          <p>Discover jobs, free training, government schemes, and AI career guidance — in your language, at your pace.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-white btn-lg">Get Started Free <ArrowRight size={16} /></Link>
            <Link to="/chatbot" className="btn btn-outline-white btn-lg">Talk to AI Guide</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{background:'white',borderBottom:'1px solid #fce7f3',padding:'32px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:24,textAlign:'center'}}>
          {[
            { label: 'Women Empowered', value: stats.total_women.toLocaleString() || '0' },
            { label: 'Active Jobs', value: stats.active_jobs.toLocaleString() || '0' },
            { label: 'Training Courses', value: stats.active_courses.toLocaleString() || '0' },
            { label: 'Govt. Schemes', value: stats.active_schemes.toLocaleString() || '0' },
          ].map(s => (
            <div key={s.label}>
              <div style={{fontSize:36,fontFamily:'var(--font-display)',fontWeight:700,color:'var(--pink-700)'}}>{s.value}+</div>
              <div style={{fontSize:14,color:'var(--gray-500)',marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{padding:'64px 24px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:32}}>Everything You Need to Succeed</h2>
          <p style={{color:'var(--gray-500)',marginTop:8,fontSize:16}}>Built for rural India — offline-ready, multilingual, and privacy-first.</p>
        </div>
        <div className="grid grid-3">
          {features.map(f => (
            <div key={f.title} className="card card-body" style={{cursor:'default'}}>
              <div style={{width:48,height:48,borderRadius:12,background:f.bg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{fontSize:16,marginBottom:8}}>{f.title}</h3>
              <p style={{fontSize:14,color:'var(--gray-500)',lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{background:'linear-gradient(135deg,#fdf2f8,white)',padding:'64px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:32,marginBottom:8}}>How Shakti Works</h2>
          <p style={{color:'var(--gray-500)',marginBottom:48,fontSize:16}}>Four simple steps to transform your career journey</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
            {steps.map((s,i) => (
              <div key={i} style={{textAlign:'center',padding:24}}>
                <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,var(--pink-400),var(--pink-700))',color:'white',fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                  {s.num}
                </div>
                <h3 style={{fontSize:16,marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:13,color:'var(--gray-500)',lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'linear-gradient(135deg,var(--pink-600),var(--pink-800))',padding:'64px 24px',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <h2 style={{color:'white',fontSize:32,marginBottom:12}}>Ready to Begin Your Journey?</h2>
          <p style={{color:'rgba(255,255,255,0.8)',marginBottom:28,fontSize:16}}>Join thousands of rural women who have found jobs, skills, and independence through Shakti.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/register" className="btn btn-white btn-lg">Register as a Woman <ArrowRight size={16} /></Link>
            <Link to="/register?role=org" className="btn btn-outline-white btn-lg">Register as Organization</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
