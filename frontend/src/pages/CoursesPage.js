import React, { useState, useEffect } from 'react';
import { DEMO_COURSES } from '../utils/demoData';
import { coursesAPI, recommendationsAPI } from '../utils/api';
import {
  GraduationCap,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Award,
  Users,
  Clock,
  Info,
  X,
  Monitor,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CoursesPage() {
  const [courses, setCourses] = useState(DEMO_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        let loaded = [];
        try {
          const res = await recommendationsAPI.getCourses(25);
          const mlList = res.data?.data || res.data?.courses;
          if (Array.isArray(mlList) && mlList.length > 0) {
            loaded = mlList.map(c => ({
              ...c,
              provider: c.provider || c.org_name || 'Shakti Skill Partner',
              skills_taught: Array.isArray(c.skills_taught)
                ? c.skills_taught
                : (typeof c.skills_taught === 'string'
                  ? c.skills_taught.replace(/[{}]/g, '').split(',').map(s => s.trim())
                  : ['Vocational Training'])
            }));
          }
        } catch (mlErr) {
          console.warn('ML courses fallback:', mlErr.message);
        }

        if (loaded.length === 0) {
          const dbRes = await coursesAPI.getAll({ limit: 30 });
          const dbList = dbRes.data?.data;
          if (Array.isArray(dbList) && dbList.length > 0) {
            loaded = dbList.map(c => ({
              ...c,
              provider: c.org_name || 'Certified Training Partner',
              skills_taught: Array.isArray(c.skills_taught)
                ? c.skills_taught
                : (typeof c.skills_taught === 'string'
                  ? c.skills_taught.replace(/[{}]/g, '').split(',').map(s => s.trim())
                  : ['Skill Development'])
            }));
          }
        }

        if (loaded.length > 0) {
          setCourses(loaded);
        }
      } catch (err) {
        console.warn('Using cached courses list:', err.message);
      }
    };
    loadCourses();
  }, []);

  const handleEnroll = (courseId, courseTitle) => {
    setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
    toast.success(`Successfully enrolled in ${courseTitle}! Training materials unlocked.`);
  };

  const filteredCourses = courses.filter(c => {
    const skills = Array.isArray(c.skills_taught) ? c.skills_taught : [];
    return (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some(s => String(s).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header">
        <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
          <GraduationCap size={14} /> Certified Learning Programs
        </div>
        <h1 className="page-title">Digital & Vocational Training</h1>
        <p className="page-subtitle">
          Free government and NGO-certified skill courses designed for rural women beginners.
        </p>
      </div>

      {/* Search Filter */}
      <div style={{ maxWidth: '540px', marginBottom: '32px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search courses by skill (e.g. Tailoring, Smartphone, Accounting)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid-2">
        {filteredCourses.map((course) => {
          const isEnrolled = !!enrolledCourses[course.id];
          const skillsList = Array.isArray(course.skills_taught) ? course.skills_taught : [];
          const previewSkills = skillsList.slice(0, 2);
          const remainingCount = skillsList.length - 2;

          return (
            <div key={course.id} className="card card-hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <div className="line-clamp-1" style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '600' }}>
                    {course.provider}
                  </div>
                  <span className="badge badge-secondary" style={{ fontSize: '11px', flexShrink: 0 }}>Free</span>
                </div>

                {/* Course Title */}
                <h3
                  className="line-clamp-2"
                  title={course.title}
                  style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.35', marginBottom: '8px' }}
                >
                  {course.title}
                </h3>

                {/* Metadata Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                    <Clock size={12} /> {course.duration || 'Self-paced'}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                    <Monitor size={12} /> {course.mode || 'Online'}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                    <Award size={12} color="var(--primary-700)" /> NSDC Certified
                  </span>
                </div>

                {/* Concise 2-Line Summary Preview */}
                <p
                  className="line-clamp-2"
                  style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '14px' }}
                >
                  {course.description}
                </p>

                {/* Compact Skills Preview (Max 2 + pill) */}
                {skillsList.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {previewSkills.map(skill => (
                      <span key={skill} className="badge badge-primary" style={{ fontSize: '11px' }}>
                        {skill}
                      </span>
                    ))}
                    {remainingCount > 0 && (
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        +{remainingCount} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedCourseModal(course)}
                    style={{ flex: 1 }}
                  >
                    <Info size={14} />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    onClick={() => handleEnroll(course.id, course.title)}
                    disabled={isEnrolled}
                    style={{ flex: 1.2 }}
                  >
                    {isEnrolled ? '✓ Enrolled' : 'Enroll Free'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Course Detail Modal ("After going details show it") */}
      {selectedCourseModal && (
        <div className="detail-modal-backdrop" onClick={() => setSelectedCourseModal(null)}>
          <div
            className="detail-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            {/* Modal Header */}
            <div className="detail-modal-header">
              <button
                type="button"
                onClick={() => setSelectedCourseModal(null)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '16px',
                  background: 'var(--bg-subtle)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
                title="Close modal"
              >
                <X size={18} />
              </button>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', paddingRight: '36px' }}>
                <span className="badge badge-secondary" style={{ fontSize: '11px' }}>Free Course</span>
                <span className="badge badge-primary" style={{ fontSize: '11px' }}>NSDC Recognized</span>
                <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{selectedCourseModal.mode || 'Online'}</span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                {selectedCourseModal.title}
              </h2>

              <div style={{ fontSize: '13px', color: 'var(--primary-700)', fontWeight: '600', marginTop: '4px' }}>
                Conducted by: {selectedCourseModal.provider}
              </div>
            </div>

            {/* Modal Body */}
            <div className="detail-modal-body">
              {/* Quick Specs Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
                backgroundColor: 'var(--bg-subtle)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Duration</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>{selectedCourseModal.duration || 'Self-paced'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Format</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>{selectedCourseModal.mode || 'Interactive Online'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Level</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>Beginner Friendly</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: '700' }}>Certificate</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--secondary-700)', marginTop: '2px' }}>Included (Free)</div>
                </div>
              </div>

              {/* About Course */}
              <div>
                <div className="detail-section-title">
                  <BookOpen size={16} color="var(--primary-700)" />
                  <span>About this Course</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {selectedCourseModal.description}
                </div>
              </div>

              {/* Skills Taught */}
              {Array.isArray(selectedCourseModal.skills_taught) && selectedCourseModal.skills_taught.length > 0 && (
                <div>
                  <div className="detail-section-title">
                    <CheckCircle2 size={16} color="var(--secondary-600)" />
                    <span>Skills You Will Master</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedCourseModal.skills_taught.map((s, idx) => (
                      <span
                        key={idx}
                        className="badge badge-primary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        <CheckCircle2 size={12} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div style={{
                backgroundColor: 'var(--secondary-50)',
                border: '1px solid var(--secondary-100)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--secondary-800)', marginBottom: '6px' }}>
                  🎓 What you will receive upon completion:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.6' }}>
                  <li>Official Government NSDC / Skill India aligned certificate.</li>
                  <li>Direct unlock of relevant local artisan, tailoring & digital job openings on Shakti.</li>
                  <li>Lifetime access to training materials in Hindi and regional languages.</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="detail-modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedCourseModal(null)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                type="button"
                className={`btn ${enrolledCourses[selectedCourseModal.id] ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => {
                  handleEnroll(selectedCourseModal.id, selectedCourseModal.title);
                  setSelectedCourseModal(null);
                }}
                disabled={enrolledCourses[selectedCourseModal.id]}
                style={{ flex: 1.5 }}
              >
                {enrolledCourses[selectedCourseModal.id] ? '✓ Already Enrolled' : 'Enroll Now (100% Free)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
