import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  Users,
  TrendingUp,
  Brain,
  Globe2,
  Briefcase,
  FileCheck2,
  ShieldCheck,
  Wifi,
  Building2,
  CheckCircle2,
  Lock,
  Compass,
  Check
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();

  // Animated Count-up for 0 -> 94% Match Score
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 94;
    const duration = 1600;
    const stepTime = 20;
    const stepIncrement = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setMatchCount(end);
        clearInterval(timer);
      } else {
        setMatchCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '72px', paddingBottom: '60px' }}>
      {/* 2.1 HERO SECTION WITH ANIMATED MESH GRADIENT */}
      <section
        className="mesh-gradient-container"
        style={{
          padding: '68px 20px 60px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-page)',
          minHeight: '620px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Drifting Plum, Rose, Marigold Mesh Blobs */}
        <div className="mesh-blob mesh-blob-plum" />
        <div className="mesh-blob mesh-blob-rose" />
        <div className="mesh-blob mesh-blob-marigold" />

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '56px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}
          >
            <div
              className="badge badge-primary"
              style={{
                width: 'fit-content',
                padding: '7px 16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Sparkles size={15} />
              <span>AI-Enabled Digital Literacy & Career Platform</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(36px, 5.2vw, 54px)',
                fontWeight: '800',
                color: 'var(--text-main)',
                letterSpacing: '-0.035em',
                lineHeight: '1.14'
              }}
            >
              Discover Skills. <br />
              Find Opportunities. <br />
              <span className="text-gradient-warm">Build Your Future.</span>
            </h1>

            <p
              style={{
                fontSize: '18px',
                color: 'var(--text-muted)',
                lineHeight: '1.65',
                maxWidth: '540px'
              }}
            >
              An explainable AI platform empowering rural women to discover suitable vocations, certified digital training, fair-wage local jobs, and verified government welfare schemes in their native language.
            </p>

            {/* High-Contrast Primary CTA + Ghost Secondary CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>{t('getStarted')}</span>
                <ArrowRight size={19} />
              </Link>
              <Link to="/opportunities" className="btn btn-outline btn-lg">
                <Search size={18} />
                <span>{t('exploreOpportunities')}</span>
              </Link>
            </div>

            {/* Small row of security & verification icon pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginTop: '16px',
                borderTop: '1px solid var(--border)',
                paddingTop: '22px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-body)',
                  backgroundColor: 'var(--surface)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)'
                }}
              >
                <ShieldCheck size={16} color="var(--teal-600)" />
                <span>256-Bit Encrypted Aadhaar</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-body)',
                  backgroundColor: 'var(--surface)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)'
                }}
              >
                <Globe2 size={16} color="var(--primary-600)" />
                <span>7 Indian Languages</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-body)',
                  backgroundColor: 'var(--surface)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)'
                }}
              >
                <FileCheck2 size={16} color="var(--secondary-600)" />
                <span>4,710+ Verified Schemes</span>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Glass "AI Match" Card with Parallax & Count-up Ring */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              animate={{
                y: [-6, 6, -6],
                rotate: [-0.6, 0.6, -0.6]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="card"
              style={{
                width: '100%',
                maxWidth: '470px',
                backgroundColor: 'var(--surface-glass)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '2px solid var(--primary-200)',
                boxShadow: '0 24px 48px -12px rgba(107, 45, 139, 0.22), var(--shadow-xl)',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px'
              }}
            >
              {/* Card Header with Animated Match Ring */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: 'var(--primary-gradient)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(107, 45, 139, 0.3)'
                    }}
                  >
                    <Compass size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
                      AI Empowerment Hub
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--teal-600)', fontWeight: '700' }}>
                      Hybrid Matching Engine Active
                    </div>
                  </div>
                </div>

                {/* Circular Count-up SVG Ring */}
                <div style={{ position: 'relative', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="var(--border)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="url(#plumTealGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="138"
                      animate={{ strokeDashoffset: 138 - (138 * matchCount) / 100 }}
                      transition={{ duration: 1.6, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="plumTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--primary-600)" />
                        <stop offset="100%" stopColor="var(--teal-500)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {matchCount}%
                  </span>
                </div>
              </div>

              {/* Sample Recommendation Preview */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  border: '1px solid var(--border)'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: 'var(--primary-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '6px'
                  }}
                >
                  Top Verified Match for Savitri Devi
                </div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Tailoring & Stitching Assistant
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Mahila Vikas Foundation • Varanasi, UP
                </div>

                {/* 3 Skill Chips popping in sequentially */}
                <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="badge badge-primary"
                  >
                    Tailoring
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="badge badge-primary"
                  >
                    Home-Based
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                    className="badge badge-accent"
                  >
                    ₹8,000–₹12,000/mo
                  </motion.span>
                </div>
              </div>

              {/* Duo Pill Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  style={{
                    padding: '14px',
                    backgroundColor: 'var(--teal-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--teal-100)'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--teal-700)', fontWeight: '800' }}>
                    GOVT SCHEME
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginTop: '3px' }}>
                    PM Vishwakarma
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--teal-700)', marginTop: '4px', fontWeight: '600' }}>
                    ₹15,000 Toolkit Grant
                  </div>
                </div>

                <div
                  style={{
                    padding: '14px',
                    backgroundColor: 'var(--primary-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--primary-100)'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--primary-700)', fontWeight: '800' }}>
                    FREE TRAINING
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginTop: '3px' }}>
                    Digital Banking
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--primary-700)', marginTop: '4px', fontWeight: '600' }}>
                    NSDC Certification
                  </div>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary btn-block">
                <span>Start Your Journey</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2.2 SECTION: HOW WE HELP (4 STAGE CARDS + GRADIENT BEAM + 3D TILT) */}
      <section className="container">
        <div className="page-header" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <div className="badge badge-secondary" style={{ marginBottom: '10px' }}>
            Empowerment Pathway
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em' }}>
            How We Help Rural Women
          </h2>
          <p className="page-subtitle" style={{ margin: '8px auto 0' }}>
            A structured path from basic smartphone literacy to meaningful monthly income generation.
          </p>
        </div>

        {/* 4 Cards with SVG connecting gradient beam on desktop */}
        <div style={{ position: 'relative' }}>
          {/* SVG Gradient Beam line drawing between the 4 cards */}
          <div
            className="desktop-only"
            style={{
              position: 'absolute',
              top: '56px',
              left: '8%',
              right: '8%',
              height: '4px',
              zIndex: 0,
              pointerEvents: 'none'
            }}
          >
            <svg width="100%" height="4" fill="none">
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="url(#beamGrad)"
                strokeWidth="3"
                strokeDasharray="6 6"
              />
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary-600)" />
                  <stop offset="35%" stopColor="var(--teal-500)" />
                  <stop offset="70%" stopColor="var(--secondary-500)" />
                  <stop offset="100%" stopColor="var(--accent-500)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid-4" style={{ position: 'relative', zIndex: 1 }}>
            {/* Card 1: Learn */}
            <motion.div
              whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="card card-hover-lift"
              style={{ perspective: 1000 }}
            >
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <BookOpen size={26} />
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary-200)', fontVariantNumeric: 'tabular-nums' }}>
                    01
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '800' }}>1. Learn</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Discover suitable digital literacy modules and NSDC-certified vocational training designed for complete beginners.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Discover */}
            <motion.div
              whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="card card-hover-lift"
              style={{ perspective: 1000 }}
            >
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--teal-50)',
                      color: 'var(--teal-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Search size={26} />
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--teal-200)', fontVariantNumeric: 'tabular-nums' }}>
                    02
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '800' }}>2. Discover</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Find verified part-time, home-based, and local cluster opportunities matched to your existing skills and interests.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Connect */}
            <motion.div
              whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="card card-hover-lift"
              style={{ perspective: 1000 }}
            >
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--secondary-50)',
                      color: 'var(--secondary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Users size={26} />
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--secondary-200)', fontVariantNumeric: 'tabular-nums' }}>
                    03
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '800' }}>3. Connect</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Connect directly with verified NGO foundations and self-help groups offering fair wages and prompt payouts.
                </p>
              </div>
            </motion.div>

            {/* Card 4: Grow */}
            <motion.div
              whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="card card-hover-lift"
              style={{ perspective: 1000 }}
            >
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--accent-50)',
                      color: 'var(--accent-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <TrendingUp size={26} />
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-200)', fontVariantNumeric: 'tabular-nums' }}>
                    04
                  </span>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '800' }}>4. Grow</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Follow an explainable step-by-step career roadmap toward micro-enterprise, Mudra loans, and sustainable earnings.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: WHY THIS PLATFORM? (6 HIGHLIGHT CARDS) */}
      <section style={{ backgroundColor: 'var(--surface)', padding: '68px 20px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>
              Built for Real-World Impact
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: '800' }}>Why This Platform?</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Engineered specifically for rural smartphone users with limited digital experience and low-bandwidth connectivity.
            </p>
          </div>

          <div className="grid-3">
            <div className="card card-hover-lift">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Personalized AI Guidance</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Hybrid recommendation engine combines TF-IDF content similarity with multi-criteria eligibility scoring.
                </p>
              </div>
            </div>

            <div className="card card-hover-lift">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe2 size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Local Language Support</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Interactive interface and conversational voice assistant available in Hindi, Marathi, Tamil, Telugu, and more.
                </p>
              </div>
            </div>

            <div className="card card-hover-lift">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Job Matching</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Tailored opportunities focusing on home-based stitching, artisan clusters, organic packaging, and village hubs.
                </p>
              </div>
            </div>

            <div className="card card-hover-lift">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileCheck2 size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Government Scheme Discovery</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Direct access to 4,710+ verified central and state welfare initiatives with step-by-step eligibility criteria.
                </p>
              </div>
            </div>

            <div className="card card-hover-lift">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--secondary-50)', color: 'var(--secondary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Privacy First</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Zero-knowledge Aadhaar handling with official UIDAI Verhoeff validation and 256-bit AES-GCM ciphertext storage.
                </p>
              </div>
            </div>

            <div className="card card-hover-lift">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wifi size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Low-Bandwidth Friendly</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.55' }}>
                  Lightweight pages, compressed payloads, and seamless offline data caching for weak 2G/3G rural networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FOR FOUNDATIONS & NGOS */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #2D143D 0%, #170A22 100%)',
            borderRadius: 'var(--radius-xl)',
            color: '#ffffff',
            padding: '52px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(107, 45, 139, 0.4)'
          }}
        >
          <div>
            <div
              className="badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                marginBottom: '16px'
              }}
            >
              <Building2 size={14} />
              <span>Partner Ecosystem</span>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', lineHeight: '1.25' }}>
              For Foundations, NGOs & Skill Providers
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--primary-100)', marginTop: '12px', lineHeight: '1.6' }}>
              Empower rural women in your target districts. Post certified training programs, publish piece-rate or full-time jobs, and review AI-matched candidates with verified profiles.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                <CheckCircle2 size={18} color="var(--secondary-400)" />
                <span>Post jobs with flexible home-based or cluster work models</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                <CheckCircle2 size={18} color="var(--secondary-400)" />
                <span>AI-assisted candidate shortlisting with transparent fit scores</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                <CheckCircle2 size={18} color="var(--secondary-400)" />
                <span>End-to-end applicant tracking and batch enrollment</span>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <Link to="/register" className="btn btn-secondary btn-lg">
                <Building2 size={18} />
                <span>{t('registerFoundation')}</span>
              </Link>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div
            className="card"
            style={{
              padding: '26px',
              color: 'var(--text-body)',
              boxShadow: 'var(--shadow-xl)',
              backgroundColor: '#ffffff'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px'
              }}
            >
              <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>
                NGO Candidate Matcher
              </div>
              <span className="badge badge-match">AI Rank #1</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800'
                }}
              >
                SD
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>
                  Savitri Devi
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Varanasi, UP • 2 Yrs Stitching Exp
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                marginBottom: '16px',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ fontWeight: '700', color: 'var(--primary-800)', marginBottom: '4px' }}>
                Match Highlights:
              </div>
              <div>✓ Meets 100% tailoring skill requirements</div>
              <div>✓ Located within your Varanasi operational cluster</div>
            </div>

            <Link to="/register" className="btn btn-outline btn-block">
              Explore NGO Portal
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section style={{ backgroundColor: 'var(--bg-subtle)', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Start Building Your Independent Livelihood Today
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Join thousands of rural women discovering new skills, income, and confidence with Shakti.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now
            </Link>
            <Link to="/opportunities" className="btn btn-outline btn-lg">
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
