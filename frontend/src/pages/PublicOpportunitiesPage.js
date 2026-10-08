import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_JOBS, DEMO_COURSES, DEMO_SCHEMES } from '../utils/demoData';
import { jobsAPI, coursesAPI, schemesAPI } from '../utils/api';
import {
  Search,
  Briefcase,
  GraduationCap,
  FileText,
  MapPin,
  IndianRupee,
  Lock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

// Spotlight Hover Card Component
function SpotlightCard({ children, className = '', style = {} }) {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      className={`card card-spotlight card-hover-lift ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        ...style
      }}
    >
      {/* Dynamic Cursor Spotlight Radial Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(107, 45, 139, 0.08), transparent 80%)`,
          zIndex: 1
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

export default function PublicOpportunitiesPage() {
  const [activeTab, setActiveTab] = useState('all'); // all, jobs, courses, schemes
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [courses, setCourses] = useState(DEMO_COURSES);
  const [schemes, setSchemes] = useState(DEMO_SCHEMES);
  const [totalSchemes, setTotalSchemes] = useState(4710);

  useEffect(() => {
    const fetchPublicData = async () => {
      setLoading(true);
      try {
        const [jobsRes, coursesRes, schemesRes] = await Promise.allSettled([
          jobsAPI.getAll({ limit: 8 }),
          coursesAPI.getAll({ limit: 8 }),
          schemesAPI.getAll({ limit: 8 })
        ]);

        if (jobsRes.status === 'fulfilled' && jobsRes.value.data?.data?.length) {
          setJobs(jobsRes.value.data.data);
        }
        if (coursesRes.status === 'fulfilled' && coursesRes.value.data?.data?.length) {
          setCourses(coursesRes.value.data.data);
        }
        if (schemesRes.status === 'fulfilled' && schemesRes.value.data?.data?.length) {
          setSchemes(schemesRes.value.data.data);
          if (schemesRes.value.data?.total) {
            setTotalSchemes(schemesRes.value.data.total);
          }
        }
      } catch (err) {
        console.warn('Public opportunities live fetch fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  const filteredJobs = jobs.filter(j => {
    const skills = Array.isArray(j.skills_required) ? j.skills_required : [];
    return (
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some(s => String(s).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredCourses = courses.filter(c => {
    const skills = Array.isArray(c.skills_taught) ? c.skills_taught : [];
    return (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some(s => String(s).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredSchemes = schemes.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
        <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
          <Sparkles size={13} /> Verified Opportunities
        </div>
        <h1 className="page-title">Explore Jobs, Training & Schemes</h1>
        <p className="page-subtitle" style={{ margin: '8px auto 0' }}>
          Discover verified opportunities tailored for rural women. Register to receive personalized AI matching and direct application tracking.
        </p>
      </div>

      {/* Sticky Search Bar and Spring Filter Chips */}
      <div
        style={{
          position: 'sticky',
          top: '90px',
          zIndex: 90,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'var(--surface-glass)',
          padding: '16px 20px',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)',
          marginBottom: '36px',
          maxWidth: '820px',
          margin: '0 auto 36px'
        }}
      >
        <div style={{ position: 'relative', width: '100%', marginBottom: '14px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)'
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by skill, craft, or district (e.g. Tailoring, Food Processing, Varanasi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '48px',
              minHeight: '50px',
              fontSize: '15px',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>

        {/* Filter Chips Toggling with Spring Physics */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Opportunities', icon: null, count: null },
            { id: 'jobs', label: 'Local Jobs', icon: Briefcase, count: filteredJobs.length },
            { id: 'courses', label: 'Free Courses', icon: GraduationCap, count: filteredCourses.length },
            { id: 'schemes', label: 'Govt Schemes', icon: FileText, count: `${filteredSchemes.length}+` }
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${isTabActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '7px 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {IconComponent && <IconComponent size={14} />}
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isTabActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--primary-100)',
                      color: isTabActive ? '#ffffff' : 'var(--primary-800)',
                      fontWeight: '800'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Skeleton Shimmer Loaders during fetch */}
      {loading ? (
        <div className="grid-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card" style={{ padding: '24px' }}>
              <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '20px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="skeleton" style={{ height: '28px', width: '80px', borderRadius: '999px' }} />
                <div className="skeleton" style={{ height: '28px', width: '100px', borderRadius: '999px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Jobs Section */}
          {(activeTab === 'all' || activeTab === 'jobs') && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Briefcase size={22} color="var(--primary-700)" />
                  <span>Recommended Local Jobs</span>
                </h2>
              </div>

              <div className="grid-2">
                {filteredJobs.map((job) => (
                  <SpotlightCard key={job.id}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{job.title}</h3>
                          <div style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: '700', marginTop: '3px' }}>
                            {job.company}
                          </div>
                        </div>
                        <span className="badge badge-match">{job.match_score || 94}% Fit</span>
                      </div>

                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '8px 0 16px', lineHeight: '1.55' }}>
                        {job.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                        <span className="badge badge-neutral"><MapPin size={13} /> {job.location_district}, {job.location_state}</span>
                        <span className="badge badge-accent"><IndianRupee size={13} /> ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()}/mo</span>
                        <span className="badge badge-primary">{job.job_type}</span>
                      </div>

                      {/* Lock-Tinted "Login to Apply" Button */}
                      <div style={{ marginTop: 'auto' }}>
                        <Link
                          to="/login"
                          className="btn btn-outline btn-block"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--primary-50)',
                            color: 'var(--primary-800)',
                            borderColor: 'var(--primary-300)',
                            fontWeight: '700'
                          }}
                        >
                          <Lock size={15} color="var(--primary-700)" />
                          <span>Login to Apply</span>
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* Courses Section */}
          {(activeTab === 'all' || activeTab === 'courses') && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GraduationCap size={22} color="var(--secondary-600)" />
                  <span>Certified Training Programs</span>
                </h2>
              </div>

              <div className="grid-2">
                {filteredCourses.map((course) => (
                  <SpotlightCard key={course.id}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <div className="line-clamp-1" style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '700' }}>
                          {course.provider}
                        </div>
                        <span className="badge badge-secondary">Free Certified</span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                        {course.title}
                      </h3>

                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.55' }}>
                        {course.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                        <span className="badge badge-neutral">{course.duration}</span>
                        <span className="badge badge-primary">{course.category}</span>
                      </div>

                      <div style={{ marginTop: 'auto' }}>
                        <Link
                          to="/login"
                          className="btn btn-outline btn-block"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--primary-50)',
                            color: 'var(--primary-800)',
                            borderColor: 'var(--primary-300)',
                            fontWeight: '700'
                          }}
                        >
                          <Lock size={15} color="var(--primary-700)" />
                          <span>Login to Enroll</span>
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* Schemes Section */}
          {(activeTab === 'all' || activeTab === 'schemes') && (
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={22} color="var(--accent-600)" />
                  <span>Verified Government Welfare Schemes ({totalSchemes.toLocaleString()}+)</span>
                </h2>
              </div>

              <div className="grid-2">
                {filteredSchemes.map((scheme) => (
                  <SpotlightCard key={scheme.id}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span className="badge badge-primary">{scheme.category || 'Central Scheme'}</span>
                        <span className="badge badge-neutral">{scheme.ministry || 'Govt of India'}</span>
                      </div>

                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                        {scheme.title}
                      </h3>

                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.55' }}>
                        {scheme.description}
                      </p>

                      <div style={{ marginTop: 'auto' }}>
                        <Link
                          to="/login"
                          className="btn btn-outline btn-block"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--primary-50)',
                            color: 'var(--primary-800)',
                            borderColor: 'var(--primary-300)',
                            fontWeight: '700'
                          }}
                        >
                          <Lock size={15} color="var(--primary-700)" />
                          <span>Login to Check Eligibility</span>
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
