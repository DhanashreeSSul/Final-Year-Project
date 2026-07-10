import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:12}}>
        <div className="brand-icon" style={{width:28,height:28,borderRadius:8}}>
          <Sparkles size={14} />
        </div>
        <strong>Shakti Platform</strong>
      </div>
      <p>Empowering rural women through AI-driven digital literacy and career guidance.</p>
      <p style={{marginTop:8,fontSize:12,opacity:0.6}}>
        &copy; 2025 Shakti Platform | Secured AI-Enabled Platform for Rural Women Empowerment, India
      </p>
    </footer>
  );
}
