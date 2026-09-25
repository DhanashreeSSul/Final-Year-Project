import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../utils/demoData';
import {
  User,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Edit3,
  Save,
  CheckCircle2,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Profile data from user context or demo data
  const [profileData, setProfileData] = useState({
    name: user?.name || DEMO_USERS.woman.name,
    phone: user?.phone || DEMO_USERS.woman.phone,
    state: user?.state || DEMO_USERS.woman.state,
    district: user?.district || DEMO_USERS.woman.district,
    village: user?.village || DEMO_USERS.woman.village,
    age: user?.profile?.age || 28,
    education: user?.profile?.education || '10th Standard (Matric)',
    skills: user?.profile?.skills || ['Tailoring', 'Embroidery', 'Cooking', 'Smartphone Basics'],
    interests: user?.profile?.interests || ['Textile', 'Small Business', 'Agriculture'],
    languages: user?.profile?.languages_known || ['Hindi', 'Bhojpuri'],
    experience: user?.profile?.work_experience || '2 years informal home stitching',
    careerGoal: user?.profile?.career_goal || 'Start a tailoring micro-enterprise and earn ₹12,000/month',
    preferredWorkType: user?.profile?.preferred_work_type || 'Part-time / Work from Home',
    availability: user?.profile?.availability || 'Immediate (4-5 hours/day)',
    bio: user?.profile?.bio || 'Enthusiastic rural artisan looking to upgrade stitching skills and connect with local foundations.'
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({
      name: profileData.name,
      state: profileData.state,
      district: profileData.district,
      village: profileData.village,
      profile: {
        ...user?.profile,
        age: profileData.age,
        education: profileData.education,
        skills: profileData.skills,
        interests: profileData.interests,
        languages_known: profileData.languages,
        work_experience: profileData.experience,
        career_goal: profileData.careerGoal,
        preferred_work_type: profileData.preferredWorkType,
        availability: profileData.availability,
        bio: profileData.bio
      }
    });
    setIsEditing(false);
    toast.success('Profile updated! AI recommendation scores refreshed.');
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!profileData.skills.includes(newSkill.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] });
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="container" style={{ maxWidth: '880px', paddingBottom: '60px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
            <User size={14} /> Beneficiary Profile
          </div>
          <h1 className="page-title">{profileData.name}</h1>
          <p className="page-subtitle">Manage your personal details, skills, and work preferences.</p>
        </div>

        <button
          type="button"
          className={`btn ${isEditing ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => {
            if (isEditing) handleSave({ preventDefault: () => {} });
            else setIsEditing(true);
          }}
        >
          {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Identity Card */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800' }}>
              {profileData.name.charAt(0)}
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{profileData.name}</h2>
                <span className="badge badge-secondary"><ShieldCheck size={13} /> Aadhaar Verified</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {profileData.village ? `${profileData.village}, ` : ''}{profileData.district}, {profileData.state}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={14} /> {profileData.languages.join(', ')}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px 18px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>Profile Strength</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-700)' }}>85%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Fields Form */}
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Left Column: Work & Career Preferences */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Work Preferences</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Primary Career Goal</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.careerGoal}
                    onChange={(e) => setProfileData({ ...profileData, careerGoal: e.target.value })}
                  />
                ) : (
                  <p style={{ fontSize: '15px', color: 'var(--text-body)', fontWeight: '600' }}>{profileData.careerGoal}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Work Mode</label>
                {isEditing ? (
                  <select
                    className="form-control"
                    value={profileData.preferredWorkType}
                    onChange={(e) => setProfileData({ ...profileData, preferredWorkType: e.target.value })}
                  >
                    <option value="Part-time / Work from Home">Part-time / Work from Home</option>
                    <option value="Village Cluster Hub">Village Cluster Hub</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Piece-rate Flexible">Piece-rate Flexible</option>
                  </select>
                ) : (
                  <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{profileData.preferredWorkType}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Daily Availability</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.availability}
                    onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
                  />
                ) : (
                  <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{profileData.availability}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Work Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  />
                ) : (
                  <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{profileData.experience}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Education */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Skills & Education</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Education Level</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={profileData.education}
                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                  />
                ) : (
                  <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{profileData.education}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">My Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: isEditing ? '10px' : 0 }}>
                  {profileData.skills.map((skill) => (
                    <span key={skill} className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                      {skill}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          style={{ background: 'none', border: 'none', marginLeft: '4px', cursor: 'pointer', color: 'var(--primary-800)' }}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a new skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button type="button" className="btn btn-primary btn-sm" onClick={addSkill}>
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">About / Bio</label>
                {isEditing ? (
                  <textarea
                    className="form-control"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />
                ) : (
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
