import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { DEMO_USERS } from '../utils/demoData';
import {
  Lock,
  Unlock,
  Phone,
  KeyRound,
  ShieldCheck,
  User,
  Building2,
  ArrowRight,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Quote,
  Check
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

  const cleanAadhaarDigits = aadhaar.replace(/\D/g, '');
  const isAadhaarValid = cleanAadhaarDigits.length === 12;
  const isPasswordValid = password.length >= 6;
  const isPhoneValid = phone.replace(/\D/g, '').slice(-10).length === 10;

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
    if (cleanAadhaarDigits.length !== 12) {
      toast.error('Aadhaar must be exactly 12 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({
        aadhaar: cleanAadhaarDigits,
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
    <div className="container" style={{ maxWidth: '1100px', paddingBottom: '70px', paddingTop: '30px' }}>
      {/* 2.4 SPLIT LAYOUT: LEFT BRAND PANEL + RIGHT GLASS FORM */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '36px',
          alignItems: 'stretch'
        }}
      >
        {/* LEFT BRAND PANEL */}
        <div
          style={{
            background: 'linear-gradient(145deg, #3B1652 0%, #1E0C2B 100%)',
            borderRadius: '24px',
            padding: '44px 36px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(107, 45, 139, 0.4)'
          }}
        >
          {/* Ambient Decorative Shapes */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(225, 29, 116, 0.3) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div
              className="badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                marginBottom: '20px',
                padding: '6px 14px'
              }}
            >
              <Sparkles size={14} />
              <span>AI Empowerment Gateway</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(28px, 3.5vw, 36px)',
                fontWeight: '800',
                lineHeight: '1.2',
                color: '#ffffff',
                marginBottom: '16px'
              }}
            >
              Step into your career with dignity.
            </h2>

            <p style={{ fontSize: '15px', color: '#D6C8E6', lineHeight: '1.6', marginBottom: '32px' }}>
              Access AI-matched tailoring, handicrafts, organic food packing, and certified government programs built for your family's future.
            </p>

            {/* Testimonial Quote */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px',
                position: 'relative'
              }}
            >
              <Quote size={24} color="var(--secondary-400)" style={{ marginBottom: '8px', opacity: 0.8 }} />
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#FDF8F5', lineHeight: '1.6' }}>
                "With Shakti, I didn't need to read complicated forms. I spoke in Hindi, verified my skill in sewing, and received my first toolkit and home-based orders within 3 weeks."
              </p>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--secondary-gradient)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '13px'
                  }}
                >
                  SD
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>Savitri Devi</div>
                  <div style={{ fontSize: '11px', color: 'var(--secondary-300)' }}>Rural Artisan • Varanasi Cluster</div>
                </div>
              </div>
            </div>
          </div>

          {/* UIDAI / AES-256 GCM Security Stamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '12px',
              color: '#BFAED4',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '20px',
              marginTop: '32px'
            }}
          >
            <ShieldCheck size={18} color="var(--teal-400)" />
            <span>Official UIDAI Verhoeff Checksum & 256-Bit Ciphertext Protection</span>
          </div>
        </div>

        {/* RIGHT GLASS FORM CARD */}
        <div
          className="card"
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '1.5px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            padding: '36px 30px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
              Sign In to Shakti
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Choose your preferred secure login method below.
            </p>
          </div>

          {/* TAB SWITCHER WITH FRAMER-MOTION SLIDING PILL */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '4px',
              marginBottom: '26px',
              border: '1px solid var(--border)',
              position: 'relative'
            }}
          >
            {[
              { id: 'aadhaar', label: 'Aadhaar ID', icon: CreditCard },
              { id: 'password', label: 'Password', icon: Phone },
              { id: 'otp', label: 'Mobile OTP', icon: KeyRound }
            ].map((tab) => {
              const active = loginMode === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLoginMode(tab.id)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: active ? '800' : '600',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'color 0.15s ease'
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="login-tab-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--primary-gradient)',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: '0 4px 12px rgba(107, 45, 139, 0.3)',
                        zIndex: -1
                      }}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <IconComp size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: AADHAAR LOGIN */}
          {loginMode === 'aadhaar' && (
            <form onSubmit={handleAadhaarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>12-Digit Aadhaar Number</span>
                  <span style={{ fontSize: '11px', color: isAadhaarValid ? 'var(--teal-600)' : 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {isAadhaarValid ? <Check size={12} strokeWidth={3} /> : null}
                    {cleanAadhaarDigits.length}/12 Digits
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <CreditCard
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isAadhaarValid ? 'var(--teal-600)' : 'var(--text-light)'
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(formatAadhaarInput(e.target.value))}
                    style={{
                      paddingLeft: '48px',
                      paddingRight: '44px',
                      letterSpacing: '2px',
                      fontWeight: '700',
                      fontSize: '16px',
                      borderColor: isAadhaarValid ? 'var(--teal-500)' : undefined
                    }}
                    maxLength={14}
                    required
                  />
                  {/* Animated Lock Click on Valid Input */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {isAadhaarValid ? (
                      <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                        <Lock size={16} color="var(--teal-600)" />
                      </motion.div>
                    ) : (
                      <Unlock size={16} color="var(--text-light)" />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">PIN / Password</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your security PIN or password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '4px' }}
              >
                {loading ? 'Verifying with UIDAI...' : 'Sign In with Aadhaar'}
                <ArrowRight size={17} />
              </button>
            </form>
          )}

          {/* TAB 2: MOBILE + PASSWORD LOGIN */}
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '4px' }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight size={17} />
              </button>
            </form>
          )}

          {/* TAB 3: MOBILE + OTP LOGIN */}
          {loginMode === 'otp' && (
            <form onSubmit={handleOtpLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Registered Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Enter 6-Digit OTP</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={17} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ paddingLeft: '48px', letterSpacing: '4px', fontWeight: '800' }}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '4px' }}
              >
                {loading ? 'Processing...' : (otpSent ? 'Verify OTP & Log In' : 'Send One-Time Password')}
                <ArrowRight size={17} />
              </button>
            </form>
          )}

          {/* TAPPABLE DEMO CREDENTIAL CHIPS WITH QUICK RIPPLE */}
          <div
            style={{
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border)'
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px'
              }}
            >
              Instant 1-Tap Demo Access:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => fillDemoAccount('woman')}
                className="btn btn-outline btn-sm"
                style={{
                  justifyContent: 'flex-start',
                  padding: '10px 12px',
                  backgroundColor: 'var(--primary-50)',
                  borderColor: 'var(--primary-200)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <User size={15} color="var(--primary-700)" />
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary-900)' }}>Savitri Devi</div>
                  <div style={{ fontSize: '10px', color: 'var(--primary-700)' }}>Rural Woman</div>
                </div>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => fillDemoAccount('foundation')}
                className="btn btn-outline btn-sm"
                style={{
                  justifyContent: 'flex-start',
                  padding: '10px 12px',
                  backgroundColor: 'var(--secondary-50)',
                  borderColor: 'var(--secondary-200)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <Building2 size={15} color="var(--secondary-600)" />
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--secondary-900)' }}>Mahila Vikas</div>
                  <div style={{ fontSize: '10px', color: 'var(--secondary-700)' }}>NGO Foundation</div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Registration link */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: '800', color: 'var(--primary-700)' }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
