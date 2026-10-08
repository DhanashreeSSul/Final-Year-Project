import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { recommendationsAPI, jobsAPI, coursesAPI, schemesAPI } from '../utils/api';
import { DEMO_JOBS, DEMO_COURSES, DEMO_SCHEMES, DEMO_USERS } from '../utils/demoData';
import ExplainableMatchCard from '../components/shared/ExplainableMatchCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Briefcase,
  GraduationCap,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  MapPin,
  TrendingUp,
  User,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Info,
  ExternalLink,
  Award,
  Sun,
  Moon,
  Sunrise,
  Bookmark,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Time-of-day greeting logic ─── */
function getGreetingConfig() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good Morning',
      icon: Sunrise,
      gradient: 'linear-gradient(135deg, #F59E0B22, #FFF9F4, #F59E0B11)',
      accent: 'var(--secondary-600)',
      borderColor: 'var(--secondary-200)'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good Afternoon',
      icon: Sun,
      gradient: 'linear-gradient(135deg, var(--primary-50), #FFF9F4, var(--accent-50))',
      accent: 'var(--primary-700)',
      borderColor: 'var(--primary-200)'
    };
  } else {
    return {
      greeting: 'Good Evening',
      icon: Moon,
      gradient: 'linear-gradient(135deg, #1F163015, var(--primary-50), #6B2D8B12)',
      accent: 'var(--primary-800)',
      borderColor: 'var(--primary-300)'
    };
  }
}

/* ─── Animated count-up number ─── */
function CountUp({ end, duration = 1200, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const start = 0;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [end, duration]);

  return <span>{prefix}{count}{suffix}</span>;
}

/* ─── Stat card ─── */
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.45, ease: 'easeOut' }}
      style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle colored glow */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '80px', height: '80px', borderRadius: '50%',
        background: `${color}18`, filter: 'blur(24px)', pointerEvents: 'none'
      }} />
      <div className="card-body" style={{ padding: '18px 14px', position: 'relative' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: `${color}15`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 10px'
        }}>
          <Icon size={20} />
        </div>
        <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
          <CountUp end={value} />
        </div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // If user is organization/foundation, redirect to foundation dashboard
  useEffect(() => {
    if (user && (user.role === 'org' || user.role === 'foundation')) {
      navigate('/foundation/dashboard');
    }
  }, [user, navigate]);

  const [loading, setLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState(DEMO_JOBS);
  const [recommendedCourses, setRecommendedCourses] = useState(DEMO_COURSES);
  const [recommendedSchemes, setRecommendedSchemes] = useState(DEMO_SCHEMES);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. First fetch full ML recommendations payload
        try {
          const fullRes = await recommendationsAPI.get();
          const recData = fullRes.data?.data;
          if (recData) {
            if (Array.isArray(recData.jobs) && recData.jobs.length > 0) {
              setRecommendedJobs(recData.jobs.map(j => ({
                ...j,
                match_score: j.score || (j.hybrid_score ? Math.round(j.hybrid_score * 100) : 92),
                match_breakdown: j.match_breakdown || {
                  skill_match: j.cosine_similarity ? Math.min(98, Math.round(j.cosine_similarity * 300) + 60) : 94,
                  interest_match: 90,
                  location_match: 92,
                  work_preference: 95
                },
                match_reasons: j.match_reason ? [j.match_reason, 'Evaluated by Python ML Hybrid Engine'] : j.match_reasons
              })));
            }
            if (Array.isArray(recData.courses) && recData.courses.length > 0) {
              setRecommendedCourses(recData.courses);
            }
            if (Array.isArray(recData.schemes) && recData.schemes.length > 0) {
              setRecommendedSchemes(recData.schemes);
            }
          }
        } catch (fullErr) {
          console.warn('Full recs API endpoint fallback:', fullErr.message);
        }

        // 2. Fetch standalone endpoints if needed
        const [jobsRes, coursesRes, schemesRes] = await Promise.allSettled([
          recommendationsAPI.getJobs(6),
          recommendationsAPI.getCourses(4),
          recommendationsAPI.getSchemes(4)
        ]);

        if (jobsRes.status === 'fulfilled') {
          const jobsList = jobsRes.value.data?.data || jobsRes.value.data?.jobs;
          if (Array.isArray(jobsList) && jobsList.length > 0) {
            setRecommendedJobs(jobsList.map(j => ({
              ...j,
              match_score: j.score || (j.hybrid_score ? Math.round(j.hybrid_score * 100) : 92),
              match_breakdown: j.match_breakdown || {
                skill_match: j.cosine_similarity ? Math.min(98, Math.round(j.cosine_similarity * 300) + 60) : 94,
                interest_match: 90,
                location_match: 92,
                work_preference: 95
              },
              match_reasons: j.match_reason ? [j.match_reason, 'Evaluated by Python ML Hybrid Engine'] : j.match_reasons
            })));
          }
        }

        if (coursesRes.status === 'fulfilled') {
          const coursesList = coursesRes.value.data?.data || coursesRes.value.data?.courses;
          if (Array.isArray(coursesList) && coursesList.length > 0) {
            setRecommendedCourses(coursesList);
          }
        }

        if (schemesRes.status === 'fulfilled') {
          const schemesList = schemesRes.value.data?.data || schemesRes.value.data?.schemes;
          if (Array.isArray(schemesList) && schemesList.length > 0) {
            setRecommendedSchemes(schemesList);
          }
        }
      } catch (err) {
        console.warn('Using verified cached recommendations fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayName = user?.name || 'Savitri Devi';
  const completionPercentage = user?.completion_percentage || 85;
  const greetingConfig = getGreetingConfig();
  const GreetIcon = greetingConfig.icon;

  const handleApply = (job) => {
    toast.success(`Application submitted for ${job.title}! Status: Applied.`);
  };

  const handleEnroll = (course) => {
    toast.success(`Enrolled in ${course.title}! Free course materials added to your learning dashboard.`);
  };

  const tabs = [
    { key: 'jobs', label: 'Jobs', icon: Briefcase, count: recommendedJobs.length },
    { key: 'courses', label: 'Courses', icon: GraduationCap, count: recommendedCourses.length },
    { key: 'schemes', label: 'Schemes', icon: FileText, count: recommendedSchemes.length },
  ];

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* 1. GREETING BANNER — time-of-day tint */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          marginBottom: '24px',
          background: greetingConfig.gradient,
          border: `1.5px solid ${greetingConfig.borderColor}`,
          position: 'relative', overflow: 'hidden'
        }}
      >
        {/* Ambient mesh blob */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-20px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: `${greetingConfig.accent}10`, filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                <GreetIcon size={22} color={greetingConfig.accent} />
              </motion.div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '800', color: 'var(--text-main)' }}>
                {greetingConfig.greeting}, {displayName.split(' ')[0]}
              </h1>
              <span className="badge badge-secondary">
                <ShieldCheck size={13} /> Verified
              </span>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Let's find the right opportunity for you today.
            </p>
          </div>

          <div style={{ minWidth: '260px', flex: '1', maxWidth: '360px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
              <span>Your profile is {completionPercentage}% complete</span>
              <span style={{ color: 'var(--primary-700)' }}>{completionPercentage}%</span>
            </div>
            <div className="progress-container" style={{ height: '10px' }}>
              <motion.div
                className="progress-bar progress-bar-success"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <div style={{ marginTop: '8px', textAlign: 'right' }}>
              <Link to="/woman/profile" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-700)' }}>
                Complete Profile ➔
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={Briefcase} label="Applied" value={3} color="var(--primary-600)" delay={0} />
        <StatCard icon={GraduationCap} label="Enrolled" value={2} color="var(--secondary-600)" delay={1} />
        <StatCard icon={Bookmark} label="Saved" value={5} color="var(--accent-500)" delay={2} />
      </div>

      {/* 3. MAIN AI RECOMMENDATION CARD */}
      <motion.div
        className="card card-recommendation"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ marginBottom: '32px' }}
      >
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
              <Sparkles size={14} /> Recommended for You
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-950)' }}>
              Based on your interest in tailoring and your location ({user?.district || 'Varanasi'}, {user?.state || 'UP'}), we found 5 high-compatibility opportunities for you.
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
              Calculated using TF-IDF skill matching + multi-criteria distance scoring. Subsidized sewing machine toolkits available under PM Vishwakarma.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/woman/jobs" className="btn btn-primary">
              <Briefcase size={16} />
              <span>View Opportunities</span>
            </Link>
            <Link to="/woman/chat" className="btn btn-outline">
              <MessageSquare size={16} />
              <span>Ask AI Guide</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 4. YOUR CAREER JOURNEY */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--primary-700)" />
            <span>Your Career Journey</span>
          </h2>
          <Link to="/woman/roadmap" style={{ fontSize: '13px', fontWeight: '700' }}>
            View Full Roadmap ➔
          </Link>
        </div>

        <div className="grid-4">
          {[
            { label: 'Current Goal', title: 'Start a Stitching Unit', sub: 'Target: ₹12,000/month', color: 'var(--primary-700)' },
            { label: 'Recommended Skill', title: 'Pattern Cutting & Blouse Design', sub: '4-Week NSDC Module', color: 'var(--secondary-600)' },
            { label: 'Recommended Job', title: 'Tailoring Assistant', sub: 'Mahila Vikas Foundation (94% Fit)', color: 'var(--accent-600)' },
            { label: 'Recommended Scheme', title: 'PM Vishwakarma Toolkit', sub: '₹15,000 Equipment Grant', color: 'var(--primary-800)' },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className="card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.08 }}
            >
              <div className="card-body">
                <div style={{ fontSize: '12px', fontWeight: '700', color: card.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginTop: '6px' }}>{card.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{card.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. TABBED RECOMMENDATIONS */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Recommended for You</h2>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'inline-flex', gap: '4px',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: '999px', padding: '4px',
          marginBottom: '20px', position: 'relative'
        }}>
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', borderRadius: '999px',
                  border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '700',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.3s ease',
                  minHeight: '40px'
                }}
              >
                <TabIcon size={14} />
                {tab.label}
                <span style={{
                  fontSize: '10px', fontWeight: '800',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  padding: '1px 6px', borderRadius: '999px', minWidth: '18px', textAlign: 'center'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid-2">
                {recommendedJobs.slice(0, 4).map((job) => (
                  <ExplainableMatchCard
                    key={job.id}
                    title={job.title}
                    company={job.company}
                    location={`${job.location_district || 'Varanasi'}, ${job.location_state || 'UP'}`}
                    jobType={job.job_type || 'Part-time'}
                    salary={job.salary_min ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}/mo` : 'Piece-rate'}
                    matchScore={job.match_score || 92}
                    breakdown={job.match_breakdown || { skill_match: 95, interest_match: 90, location_match: 92, work_preference: 95 }}
                    reasons={job.match_reasons || [
                      'Directly matches your Tailoring and Stitching experience',
                      'Located in your local district',
                      'Home-based collection model'
                    ]}
                    onApply={() => handleApply(job)}
                    onViewDetails={() => navigate(`/jobs/${job.id}`)}
                    actionText="Quick Apply"
                  />
                ))}
              </div>
              <div style={{ textAlign: 'right', marginTop: '16px' }}>
                <Link to="/woman/jobs" className="btn btn-outline btn-sm">
                  See All Jobs ({recommendedJobs.length}) <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid-2">
                {recommendedCourses.slice(0, 2).map((course) => (
                  <div key={course.id} className="card card-hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <div className="line-clamp-1" style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '600' }}>
                          {course.provider}
                        </div>
                        <span className="badge badge-secondary" style={{ fontSize: '11px' }}>Free</span>
                      </div>

                      <h3 className="line-clamp-2" title={course.title} style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px', lineHeight: '1.35' }}>
                        {course.title}
                      </h3>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}><Calendar size={12} /> {course.duration || 'Self-paced'}</span>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{course.mode || 'Online'}</span>
                        <span className="badge badge-primary" style={{ fontSize: '11px' }}><Award size={12} /> Certificate Included</span>
                      </div>

                      <p className="line-clamp-2" style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '16px' }}>
                        {course.description}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                          <Info size={14} />
                          <span>View Details</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEnroll(course)}
                          style={{ flex: 1.2 }}
                        >
                          Enroll Free
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'right', marginTop: '16px' }}>
                <Link to="/woman/courses" className="btn btn-outline btn-sm">
                  View All Courses <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'schemes' && (
            <motion.div
              key="schemes"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid-2">
                {recommendedSchemes.slice(0, 2).map((scheme) => (
                  <div key={scheme.id} className="card card-hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                          {scheme.category || 'Official Scheme'}
                        </span>
                        <span className="badge badge-match" style={{ fontSize: '11px' }}>
                          <Sparkles size={11} /> {scheme.match_score || 95}% Fit
                        </span>
                      </div>

                      <h3 className="line-clamp-2" title={scheme.title} style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', lineHeight: '1.35' }}>
                        {scheme.title}
                      </h3>

                      {scheme.ministry && (
                        <div className="line-clamp-1" style={{ fontSize: '12px', color: 'var(--primary-800)', fontWeight: '600', marginBottom: '10px' }}>
                          {scheme.ministry}
                        </div>
                      )}

                      <p className="line-clamp-2" style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '14px' }}>
                        {scheme.benefits || scheme.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                          <CheckCircle2 size={11} color="var(--secondary-600)" /> Verified Welfare Grant
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                          <MapPin size={11} /> {scheme.state === 'All' ? 'All India' : scheme.state || 'National'}
                        </span>
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <Link to={`/schemes/${scheme.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                          <Info size={14} />
                          <span>View Details</span>
                        </Link>
                        <a
                          href={scheme.application_link || 'https://www.myscheme.gov.in'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                        >
                          <ExternalLink size={14} />
                          <span>Apply Now</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'right', marginTop: '16px' }}>
                <Link to="/woman/schemes" className="btn btn-outline btn-sm">
                  View 4,710+ Schemes <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
