import React, { useState } from 'react';
import { DEMO_COURSES } from '../utils/demoData';
import {
  GraduationCap,
  PlusCircle,
  Clock,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrgCoursesPage() {
  const [courses, setCourses] = useState(DEMO_COURSES);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    duration: '4 Weeks',
    mode: 'Hybrid (Village Hub + Video Lessons)',
    skills_taught: '',
    seats: 30,
    description: ''
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newCourse = {
      id: `course-${Date.now()}`,
      title: formData.title,
      provider: 'Mahila Vikas Foundation',
      duration: formData.duration,
      mode: formData.mode,
      skills_taught: formData.skills_taught.split(',').map(s => s.trim()),
      certification: true,
      is_free: true,
      description: formData.description,
      seats: Number(formData.seats)
    };
    setCourses([newCourse, ...courses]);
    setShowModal(false);
    toast.success('Training program published to rural women network!');
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success('Program archived.');
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>
            <GraduationCap size={14} /> Vocational Skilling Hub
          </div>
          <h1 className="page-title">Manage Training Programs</h1>
          <p className="page-subtitle">Publish certified skilling batches for rural women in your district.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={18} />
          <span>Post Training Program</span>
        </button>
      </div>

      <div className="grid-2">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{course.title}</h3>
                <span className="badge badge-secondary">Active</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>Provider: {course.provider}</div>

              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {course.skills_taught?.map(s => (
                  <span key={s} className="badge badge-primary">{s}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <span><Clock size={13} style={{ display: 'inline' }} /> {course.duration}</span>
                <span><Users size={13} style={{ display: 'inline' }} /> {course.seats || 30} Seats</span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => toast.success('Viewing enrolled batch list...')}
                >
                  View Enrolled (18)
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(course.id)}
                  style={{ color: 'var(--text-light)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '580px', width: '100%', padding: '28px', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>
              Publish New Vocational Program
            </h2>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Advanced Blouse Design & Quality Finishing"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Describe the training schedule and materials provided..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skills Taught (Comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Sewing Machine, Pattern Making, Pricing"
                  value={formData.skills_taught}
                  onChange={(e) => setFormData({ ...formData, skills_taught: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Seats</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Publish Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
