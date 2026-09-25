import React from 'react';
import { Link } from 'react-router-dom';
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
  PhoneCall,
  Lock,
  Compass
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '60px' }}>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, var(--primary-50) 0%, #ffffff 100%)',
        padding: '56px 20px 48px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Left Hero Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="badge badge-primary" style={{ width: 'fit-content', padding: '6px 14px' }}>
              <Sparkles size={15} />
              <span>AI-Enabled Digital Literacy & Career Platform</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: '1.15' }}>
              Discover Skills. <br />
              Find Opportunities. <br />
              <span style={{ color: 'var(--primary-700)' }}>Build Your Future.</span>
            </h1>

            <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '540px' }}>
              An AI-powered platform helping rural women discover suitable careers, training programs, jobs, and verified government schemes in their own language.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>{t('getStarted')}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/opportunities" className="btn btn-outline btn-lg">
                <Search size={18} />
                <span>{t('exploreOpportunities')}</span>
              </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="var(--secondary-600)" />
                <span>256-Bit Encrypted Aadhaar</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <Globe2 size={16} color="var(--primary-600)" />
                <span>7 Indian Languages</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <FileCheck2 size={16} color="var(--accent-600)" />
                <span>4,710+ Verified Schemes</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Illustration (Clean SVG, No Stock Images / Emojis) */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '2px solid var(--primary-100)',
              boxShadow: 'var(--shadow-xl)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Compass size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>AI Empowerment Hub</div>
                    <div style={{ fontSize: '12px', color: 'var(--secondary-600)', fontWeight: '600' }}>Active Matching Engine</div>
                  </div>
                </div>
                <span className="badge badge-match">94% Fit</span>
              </div>

              {/* Sample Recommendation Preview */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Top Match for Savitri Devi
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Tailoring & Stitching Assistant
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Mahila Vikas Foundation • Varanasi, UP
                </div>

                <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">Tailoring</span>
                  <span className="badge badge-primary">Home-Based</span>
                  <span className="badge badge-accent">₹8,000–₹12,000/mo</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--secondary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--secondary-100)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--secondary-700)', fontWeight: '700' }}>GOVT SCHEME</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>PM Vishwakarma</div>
                  <div style={{ fontSize: '11px', color: 'var(--secondary-700)', marginTop: '4px' }}>₹15,000 Sewing Toolkit</div>
                </div>

                <div style={{ padding: '12px', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-100)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--primary-700)', fontWeight: '700' }}>FREE TRAINING</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>Digital Banking</div>
                  <div style={{ fontSize: '11px', color: 'var(--primary-700)', marginTop: '4px' }}>NSDC Certification</div>
                </div>
              </div>

              <Link to="/register" className="btn btn-primary btn-block" style={{ marginTop: '4px' }}>
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: HOW WE HELP WOMEN (4 CARDS) */}
      <section className="container">
        <div className="page-header" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800' }}>How We Help Women</h2>
          <p className="page-subtitle" style={{ margin: '8px auto 0' }}>
            A structured path from basic smartphone literacy to meaningful income generation.
          </p>
        </div>

        <div className="grid-4">
          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>1. Learn</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Discover suitable digital literacy and certified vocational training designed for beginners.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--secondary-50)', color: 'var(--secondary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>2. Discover</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Find verified part-time, home-based, and local cluster jobs matched to your existing skills.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>3. Connect</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Connect directly with verified NGO foundations and rural self-help groups offering fair wages.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>4. Grow</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Follow an explainable step-by-step career roadmap toward micro-enterprise and financial independence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHY THIS PLATFORM? (6 CARDS) */}
      <section style={{ backgroundColor: '#ffffff', padding: '64px 20px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 44px' }}>
            <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>
              Built for Real-World Impact
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Why This Platform?</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Engineered specifically for rural smartphone users with limited digital experience and low-bandwidth connectivity.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Brain size={26} color="var(--primary-700)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Personalized AI Guidance</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Hybrid recommendation engine combines TF-IDF content similarity with multi-criteria eligibility scoring.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Globe2 size={26} color="var(--primary-700)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Local Language Support</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Interactive interface and conversational voice assistant available in Hindi, Marathi, Tamil, Telugu, and more.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Briefcase size={26} color="var(--primary-700)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Job Matching</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Tailored opportunities focusing on home-based stitching, artisan clusters, organic packaging, and village hubs.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FileCheck2 size={26} color="var(--primary-700)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Government Scheme Discovery</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Direct access to 4,710+ verified central and state welfare initiatives with step-by-step eligibility criteria.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ShieldCheck size={26} color="var(--secondary-600)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Privacy First</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Zero-knowledge Aadhaar handling with official UIDAI Verhoeff validation and 256-bit AES-GCM ciphertext storage.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Wifi size={26} color="var(--primary-700)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Low-Bandwidth Friendly</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Lightweight pages, compressed payloads, and seamless offline data caching for weak 2G/3G rural networks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FOR FOUNDATIONS & NGOS */}
      <section className="container">
        <div style={{
          backgroundColor: 'var(--primary-900)',
          borderRadius: 'var(--radius-xl)',
          color: '#ffffff',
          padding: '48px 36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '36px',
          alignItems: 'center'
        }}>
          <div>
            <div className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', marginBottom: '16px' }}>
              <Building2 size={14} />
              <span>Partner Ecosystem</span>
            </div>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff', lineHeight: '1.25' }}>
              For Foundations, NGOs & Skill Organizations
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--primary-200)', marginTop: '12px', lineHeight: '1.6' }}>
              Empower rural women in your target districts. Post certified training programs, publish piece-rate or full-time jobs, and review AI-matched candidates with verified profiles.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                <CheckCircle2 size={18} color="var(--secondary-500)" />
                <span>Post jobs with flexible home-based or cluster work models</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                <CheckCircle2 size={18} color="var(--secondary-500)" />
                <span>AI-assisted candidate shortlisting with transparent fit scores</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                <CheckCircle2 size={18} color="var(--secondary-500)" />
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
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            color: 'var(--text-body)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>NGO Candidate Matcher</div>
              <span className="badge badge-match">AI Rank #1</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                SD
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-main)' }}>Savitri Devi</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Varanasi, UP • 2 Yrs Stitching Exp</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '14px' }}>
              <div style={{ fontWeight: '600', color: 'var(--primary-800)', marginBottom: '4px' }}>Match Highlights:</div>
              <div>✓ Meets 100% tailoring skill requirements</div>
              <div>✓ Located within your Varanasi operational cluster</div>
            </div>

            <Link to="/register" className="btn btn-outline btn-block btn-sm">
              Explore NGO Portal
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS (4-STEP VISUAL FLOW) */}
      <section className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800' }}>How It Works</h2>
          <p className="page-subtitle" style={{ margin: '8px auto 0' }}>
            Four straightforward steps designed for women of all educational backgrounds.
          </p>
        </div>

        <div className="grid-4" style={{ position: 'relative' }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800', fontSize: '18px' }}>
                1
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Create Profile</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Sign up with your mobile number. Verify your identity securely through encrypted Aadhaar check.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800', fontSize: '18px' }}>
                2
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Tell Us Your Interests</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Pick from visual cards: Tailoring, Handicrafts, Agriculture, Teaching, Small Business, or Food.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800', fontSize: '18px' }}>
                3
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Get Recommendations</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Our AI analyzes compatibility scores and suggests top jobs, free training, and grants with clear explanations.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--secondary-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800', fontSize: '18px' }}>
                4
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>Apply and Grow</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Apply in 1 tap, track interview progress, and follow your career roadmap toward sustainable earnings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section style={{ backgroundColor: 'var(--bg-subtle)', padding: '56px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)' }}>
            Start Building Your Independent Livelihood Today
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            Join thousands of rural women discovering new skills, income, and confidence with Shakti.
          </p>
          <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
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
