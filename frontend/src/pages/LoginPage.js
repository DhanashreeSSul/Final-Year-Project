import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
      navigate(res.data.user.role === 'org' ? '/org/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div className="auth-logo">
          <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:52,height:52,borderRadius:16,background:'linear-gradient(135deg,var(--pink-500),var(--pink-700))',marginBottom:12}}>
            <Sparkles size={24} color="white" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Shakti account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div style={{position:'relative'}}>
              <Phone size={16} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--gray-400)'}} />
              <input className="form-control" style={{paddingLeft:38}} type="tel" placeholder="10-digit mobile number"
                value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} maxLength={10} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{position:'relative'}}>
              <Lock size={16} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--gray-400)'}} />
              <input className="form-control" style={{paddingLeft:38,paddingRight:40}} type={showPwd ? 'text' : 'password'}
                placeholder="Your password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} />
              <button type="button" onClick={() => setShowPwd(p => !p)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--gray-400)'}}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:8}} disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'var(--gray-500)'}}>
          Don't have an account? <Link to="/register" style={{color:'var(--pink-600)',fontWeight:600}}>Register Free</Link>
        </p>
      </div>
    </div>
  );
}
