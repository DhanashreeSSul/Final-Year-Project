import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../utils/demoData';
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Edit3,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrgProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const org = user?.org || DEMO_USERS.foundation.org;

  const [orgData, setOrgData] = useState({
    name: org.org_name || 'Mahila Vikas Foundation',
    type: org.org_type || 'Non-Governmental Organization (NGO)',
    regNumber: org.registration_number || 'NGO/MH/2018/009182',
    sector: org.sector || 'Women Vocational Training & Rural Livelihoods',
    contactPerson: org.contact_person || 'Sunita Patil (Program Director)',
    phone: user?.phone || '9000000001',
    email: user?.email || 'contact@mahilavikas.org',
    website: org.website || 'https://mahilavikas.org',
    address: org.address || 'Plot 42, Gram Panchayat Road, Pimpri, Pune, MH - 411018',
    description: org.description || 'Dedicated to skilling rural women through sustainable livelihood programs and fair-wage job linkages.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Organization profile details saved.');
  };

  return (
    <div className="container" style={{ maxWidth: '840px', paddingBottom: '60px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-secondary" style={{ marginBottom: '8px' }}>
            <Building2 size={14} /> Organization Profile
          </div>
          <h1 className="page-title">{orgData.name}</h1>
          <p className="page-subtitle">Verified NGO / Foundation profile and operational credentials.</p>
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
          <span>{isEditing ? 'Save Details' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--secondary-50)', color: 'var(--secondary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={32} />
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{orgData.name}</h2>
                <span className="badge badge-secondary"><ShieldCheck size={13} /> Verified NGO</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Registration ID: <strong>{orgData.regNumber}</strong> • {orgData.type}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '17px', fontWeight: '700' }}>Organization Details</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Sector & Focus Area</label>
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                value={orgData.sector}
                onChange={(e) => setOrgData({ ...orgData, sector: e.target.value })}
              />
            ) : (
              <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{orgData.sector}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">About the Organization</label>
            {isEditing ? (
              <textarea
                className="form-control"
                value={orgData.description}
                onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
              />
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{orgData.description}</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{orgData.contactPerson}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Official Phone</label>
              <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{orgData.phone}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <p style={{ fontSize: '15px', color: 'var(--text-body)' }}>{orgData.email}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Operating Address</label>
            <p style={{ fontSize: '14px', color: 'var(--text-body)' }}>{orgData.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
