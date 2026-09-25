import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { DEMO_USERS } from '../utils/demoData';
import {
  Lock,
  Phone,
  KeyRound,
  ShieldCheck,
  User,
  Building2,
  ArrowRight,
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState('aadhaar'); // 'aadhaar', 'password', 'otp'
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Format Aadhaar number with spaces (XXXX XXXX XXXX)
  const formatAadhaarInput = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleSendOTP = async (targetPhone) => {
    const num = targetPhone || phone;
    const cleanNum = String(num).replace(/\D/g, '').slice(-10);
    if (!cleanNum || cleanNum.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.sendOTP(cleanNum, 'login');
      setOtpSent(true);
      if (res.data?.otp) {
        toast.success(`OTP generated: ${res.data.otp} (Valid for 10 min)`);
      } else {
        toast.success('OTP sent to your registered mobile number');
      }
    } catch (err) {
      setOtpSent(true);
      toast.success('Test OTP code: 123456');
    } finally {
      setLoading(false);
    }
  };

  // 1. Aadhaar-Based Login Handler
  const handleAadhaarLogin = async (e) => {
    e.preventDefault();
    const cleanAadhaar = String(aadhaar).replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      toast.error('Aadhaar must be exactly 12 digits');
      return;
    }

    setLoading(true);
    try {
      // Connects directly to backend PostgreSQL authController (AES-256-GCM + Verhoeff)
      const res = await authAPI.login({
        aadhaar: cleanAadhaar,
        password: password || 'password123'
      });

      login(res.data.token, res.data.user);
      toast.success(`Aadhaar verified! Welcome back, ${res.data.user.name}`);
      if (res.data.user.role === 'org') navigate('/foundation/dashboard');
      else navigate('/woman/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Aadhaar login failed. Check credentials or register.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Mobile + Password Login Handler
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login({ phone: cleanPhone, password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name || 'User'}!`);
      if (res.data.user.role === 'org') navigate('/foundation/dashboard');
      else navigate('/woman/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Mobile + OTP Login Handler
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    if (!otpSent) {
      handleSendOTP(cleanPhone);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login({ phone: cleanPhone, otp, method: 'otp' });
      login(res.data.token, res.data.user);
      toast.success('OTP verified successfully!');
      if (res.data.user.role === 'org') navigate('/foundation/dashboard');
      else navigate('/woman/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = async (roleKey) => {
    setLoading(true);
    try {
      if (roleKey === 'woman') {
        setAadhaar('5678 9012 3458');
        setPhone('9000000002');
        setPassword('password123');
        const res = await authAPI.login({ aadhaar: '567890123458', password: 'password123' });
        login(res.data.token, res.data.user);
        toast.success(`Aadhaar Verified: Welcome ${res.data.user.name}`);
        navigate('/woman/dashboard');
        return;
      } else {
        setPhone('9000000001');
        setPassword('password123');
        const res = await authAPI.login({ phone: '9000000001', password: 'password123' });
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}`);
        navigate('/foundation/dashboard');
        return;
      }
    } catch (err) {
      console.warn('Backend login fallback for demo:', err.message);
      const account = DEMO_USERS[roleKey];
      login('demo-session-token', account);
      toast.success(`Demo session: ${account.name}`);
      if (account.role === 'org') navigate('/foundation/dashboard');
      else navigate('/woman/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '520px', paddingBottom: '60px' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
          <ShieldCheck size={14} /> Secured Verification Portal
        </div>
        <h1 className="page-title">Sign In to Shakti</h1>
        <p className="page-subtitle" style={{ margin: '6px auto 0' }}>
          Access your personalized AI recommendations and verified opportunities.
        </p>
      </div>

      <div className="card">
        {/* 3 Login Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={() => setLoginMode('aadhaar')}
            style={{
              padding: '14px 8px',
              border: 'none',
              background: loginMode === 'aadhaar' ? 'var(--primary-50)' : '#ffffff',
              color: loginMode === 'aadhaar' ? 'var(--primary-800)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              borderBottom: loginMode === 'aadhaar' ? '2px solid var(--primary-700)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <CreditCard size={14} />
            <span>Aadhaar ID</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMode('password')}
            style={{
              padding: '14px 8px',
              border: 'none',
              background: loginMode === 'password' ? 'var(--primary-50)' : '#ffffff',
              color: loginMode === 'password' ? 'var(--primary-800)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              borderBottom: loginMode === 'password' ? '2px solid var(--primary-700)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Phone size={14} />
            <span>Password</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMode('otp')}
            style={{
              padding: '14px 8px',
              border: 'none',
              background: loginMode === 'otp' ? 'var(--primary-50)' : '#ffffff',
              color: loginMode === 'otp' ? 'var(--primary-800)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              borderBottom: loginMode === 'otp' ? '2px solid var(--primary-700)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <KeyRound size={14} />
            <span>Mobile OTP</span>
          </button>
        </div>

        <div className="card-body">
          {/* TAB 1: AADHAAR LOGIN */}
          {loginMode === 'aadhaar' && (
            <form onSubmit={handleAadhaarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--secondary-50)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--secondary-100)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--secondary-700)' }}>
                <ShieldCheck size={16} />
                <span>UIDAI Verhoeff Checksum & 256-Bit Encrypted</span>
              </div>

              <div className="form-group">
                <label className="form-label">12-Digit Aadhaar Number</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="XXXX XXXX XXXX (e.g. 5678 9012 3458)"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(formatAadhaarInput(e.target.value))}
                    style={{ paddingLeft: '42px', letterSpacing: '2px', fontWeight: '600' }}
                    maxLength={14}
                    required
                  />
                </div>
                <span className="form-hint">
                  Demo Aadhaar for Savitri Devi: <strong>5678 9012 3458</strong>
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Password / PIN</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password (default: password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                <span>{loading ? 'Authenticating with Aadhaar...' : 'Sign In with Aadhaar'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* TAB 2: MOBILE + PASSWORD */}
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Registered Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password / PIN</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password or PIN"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                <span>{loading ? 'Signing in...' : 'Sign In with Password'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* TAB 3: MOBILE OTP */}
          {loginMode === 'otp' && (
            <form onSubmit={handleOtpLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                    disabled={otpSent}
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ paddingLeft: '42px', letterSpacing: '4px', fontSize: '18px', fontWeight: '700' }}
                      maxLength={6}
                      required
                    />
                  </div>
                  <span className="form-hint">OTP valid for 10 minutes.</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '8px' }}
              >
                {otpSent ? 'Verify OTP & Enter' : 'Send One-Time Password'}
              </button>
            </form>
          )}

          {/* Quick Evaluation Presets */}
          <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', textAlign: 'center' }}>
              Quick Academic Presentation Presets
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fillDemoAccount('woman')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <User size={14} color="var(--primary-700)" />
                <span>Savitri Devi (Aadhaar: 3458)</span>
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fillDemoAccount('foundation')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <Building2 size={14} color="var(--secondary-600)" />
                <span>Mahila Vikas (NGO)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="card-footer" style={{ textAlign: 'center', fontSize: '14px' }}>
          New to Shakti? <Link to="/register" style={{ fontWeight: '700', color: 'var(--primary-700)' }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}
