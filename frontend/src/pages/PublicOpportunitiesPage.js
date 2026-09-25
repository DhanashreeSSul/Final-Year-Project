import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DEMO_JOBS, DEMO_COURSES, DEMO_SCHEMES } from '../utils/demoData';
import { jobsAPI, coursesAPI, schemesAPI } from '../utils/api';
import {
  Search,
  Briefcase,
  GraduationCap,
  FileText,
  MapPin,
  IndianRupee,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function PublicOpportunitiesPage() {
  const [activeTab, setActiveTab] = useState('all'); // all, jobs, courses, schemes
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [courses, setCourses] = useState(DEMO_COURSES);
  const [schemes, setSchemes] = useState(DEMO_SCHEMES);
  const [totalSchemes, setTotalSchemes] = useState(4710);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicData = async () => {
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
          Verified Opportunities
        </div>
        <h1 className="page-title">Explore Jobs, Training & Schemes</h1>
        <p className="page-subtitle" style={{ margin: '8px auto 0' }}>
          Discover verified opportunities tailored for rural women. Register to get personalized AI matching.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '640px', margin: '0 auto 28px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by skill (e.g. Tailoring, Handicrafts, Smartphone)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '46px', minHeight: '52px', fontSize: '15px' }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('all')}
        >
          All Opportunities
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'jobs' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={15} /> Jobs ({filteredJobs.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('courses')}
        >
          <GraduationCap size={15} /> Free Courses ({filteredCourses.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'schemes' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('schemes')}
        >
          <FileText size={15} /> Govt Schemes ({filteredSchemes.length}+)
        </button>
      </div>

      {/* Jobs Section */}
      {(activeTab === 'all' || activeTab === 'jobs') && (
        <div style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} color="var(--primary-700)" />
              <span>Recommended Local Jobs</span>
            </h2>
          </div>

          <div className="grid-2">
            {filteredJobs.map((job) => (
              <div key={job.id} className="card">
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{job.title}</h3>
                      <div style={{ fontSize: '14px', color: 'var(--primary-700)', fontWeight: '600', marginTop: '2px' }}>{job.company}</div>
                    </div>
                    <span className="badge badge-match">{job.match_score}% Fit</span>
                  </div>

                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '10px 0 16px', lineHeight: '1.5' }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                    <span className="badge badge-neutral"><MapPin size={13} /> {job.location_district}, {job.location_state}</span>
                    <span className="badge badge-accent"><IndianRupee size={13} /> ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}/mo</span>
                    <span className="badge badge-primary">{job.job_type}</span>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <Link to="/register" className="btn btn-primary btn-sm btn-block">
                      <span>Apply as Beneficiary</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses Section */}
      {(activeTab === 'all' || activeTab === 'courses') && (
        <div style={{ marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={20} color="var(--secondary-600)" />
              <span>Certified Training Programs</span>
            </h2>
          </div>

          <div className="grid-2">
            {filteredCourses.map((course) => (
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
                    <span className="badge badge-neutral" style={{ fontSize: '11px' }}>Duration: {course.duration}</span>
                    <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{course.mode}</span>
                    <span className="badge badge-primary" style={{ fontSize: '11px' }}>Govt Recognized</span>
                  </div>

                  <p className="line-clamp-2" style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '16px' }}>
                    {course.description}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                    <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      <Info size={14} /> View Details
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1.2 }}>
                      Enroll Free
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Government Schemes Section */}
      {(activeTab === 'all' || activeTab === 'schemes') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--accent-600)" />
              <span>Government Schemes & Financial Grants</span>
            </h2>
          </div>

          <div className="grid-2">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="card card-hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '11px' }}>{scheme.category || 'Official Scheme'}</span>
                    <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                      <MapPin size={11} /> {scheme.state === 'All' ? 'All India' : scheme.state || 'National'}
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

                  <p className="line-clamp-2" style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '16px' }}>
                    {scheme.benefits || scheme.description}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                    <Link to={`/schemes/${scheme.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      <Info size={14} /> View Details
                    </Link>
                    <a
                      href={scheme.application_link || 'https://www.myscheme.gov.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1.2 }}
                    >
                      <ExternalLink size={14} /> Apply on Portal
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
