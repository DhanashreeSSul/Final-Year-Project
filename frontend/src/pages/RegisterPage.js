import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Phone, Lock, User, ChevronRight, RefreshCw } from 'lucide-react';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATES = ['Andhra Pradesh','Bihar','Chhattisgarh','Gujarat','Jharkhand','Karnataka','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal','Other'];
const LANGUAGES = ['en','hi','mr','te','ta','kn','gu','bn'];
const LANG_LABELS = {en:'English',hi:'हिंदी',mr:'मराठी',te:'తెలుగు',ta:'தமிழ்',kn:'ಕನ್ನಡ',gu:'ગુજરાતી',bn:'বাংলা'};

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'user';
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', password:'', confirmPassword:'', role: defaultRole, language_pref:'en', state:'', district:'', village:'' });
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) { const t = setTimeout(() => setTimer(p => p-1), 1000); return () => clearTimeout(t); }
  }, [timer]);

  const sendOTP = async () => {
    if (!form.phone || form.phone.length < 10) return toast.error('Enter valid 10-digit mobile number');
    setLoading(true);
    try {
      const res = await authAPI.sendOTP(form.phone);
      setOtpSent(true); setTimer(60);
      toast.success('OTP sent!');
      if (res.data.otp) toast(`Dev OTP: ${res.data.otp}`, { icon: 'ℹ️', duration: 10000 });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) return toast.error('Enter 6-digit OTP');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await authAPI.register({ ...form, otp: otpValue });
      login(res.data.token, res.data.user);
      toast.success('Welcome to Shakti!');
      navigate(form.role === 'org' ? '/org/dashboard' : '/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const upd = (k, v) => setForm(p => ({...p, [k]: v}));

  return (
    <div className="auth-page">
      <div className="auth-card animate-in" style={{maxWidth:480}}>
        <div className="auth-logo">
          <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:52,height:52,borderRadius:16,background:'linear-gradient(135deg,var(--pink-500),var(--pink-700))',marginBottom:12}}>
            <Sparkles size={24} color="white" />
          </div>
          <h2>Join Shakti</h2>
          <p>Create your free account</p>
        </div>

        {/* Role selector */}
        <div style={{display:'flex',gap:8,marginBottom:24,background:'var(--pink-50)',padding:4,borderRadius:12}}>
          {['user','org'].map(r => (
            <button key={r} onClick={() => upd('role',r)} style={{flex:1,padding:'8px',border:'none',borderRadius:8,cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:600,fontSize:13,transition:'all 0.2s',background:form.role===r?'white':'transparent',color:form.role===r?'var(--pink-700)':'var(--gray-500)',boxShadow:form.role===r?'var(--shadow-sm)':'none'}}>
              {r === 'user' ? 'I am a Woman' : 'Organization / NGO'}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{position:'relative'}}>
              <User size={16} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--gray-400)'}} />
              <input className="form-control" style={{paddingLeft:38}} placeholder="Your full name" value={form.name} onChange={e=>upd('name',e.target.value)} required />
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,alignItems:'end'}}>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Mobile Number</label>
              <div style={{position:'relative'}}>
                <Phone size={16} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--gray-400)'}} />
                <input className="form-control" style={{paddingLeft:38}} type="tel" placeholder="10-digit number" value={form.phone} onChange={e=>upd('phone',e.target.value)} maxLength={10} required />
              </div>
            </div>
            <button type="button" onClick={sendOTP} className="btn btn-secondary btn-sm" style={{height:44,marginBottom:18}} disabled={loading||timer>0}>
              {timer > 0 ? `${timer}s` : otpSent ? <><RefreshCw size={14}/> Resend</> : 'Send OTP'}
            </button>
          </div>
          {otpSent && (
            <div className="form-group animate-in">
              <label className="form-label">Enter 6-Digit OTP</label>
              <input className="form-control" placeholder="Enter OTP" value={otpValue} onChange={e=>setOtpValue(e.target.value)} maxLength={6} style={{letterSpacing:6,fontSize:18,textAlign:'center',fontWeight:700}} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>upd('password',e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-control" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e=>upd('confirmPassword',e.target.value)} required />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-control" value={form.state} onChange={e=>upd('state',e.target.value)}>
                <option value="">Select State</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Language</label>
              <select className="form-control" value={form.language_pref} onChange={e=>upd('language_pref',e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{LANG_LABELS[l]}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">District / Village (optional)</label>
            <input className="form-control" placeholder="e.g. Pune / Kolhapur" value={form.district} onChange={e=>upd('district',e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:8}} disabled={loading||!otpSent}>
            {loading ? <><span className="spinner"/> Creating account...</> : <>Create Account <ChevronRight size={16}/></>}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'var(--gray-500)'}}>
          Already have an account? <Link to="/login" style={{color:'var(--pink-600)',fontWeight:600}}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
