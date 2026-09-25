import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Briefcase,
  GraduationCap,
  FileText,
  Clock,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { user } = useAuth();
  const isOrg = user?.role === 'org' || user?.role === 'foundation';

  const [notifications, setNotifications] = useState(
    isOrg
      ? [
          {
            id: 1,
            title: 'New Applicant: Savitri Devi',
            message: 'Savitri Devi applied for "Tailoring & Stitching Assistant" with a 94% compatibility match.',
            time: '10 minutes ago',
            type: 'applicant',
            read: false
          },
          {
            id: 2,
            title: 'Job Deadline Approaching',
            message: 'Your job opening for "Digital Literacy Community Mobilizer" closes in 3 days.',
            time: '2 hours ago',
            type: 'deadline',
            read: false
          },
          {
            id: 3,
            title: 'New Matching Candidate Detected',
            message: '5 new rural women with embroidery skills registered in Varanasi district.',
            time: '1 day ago',
            type: 'match',
            read: true
          }
        ]
      : [
          {
            id: 1,
            title: 'Application Shortlisted!',
            message: 'Mahila Vikas Foundation shortlisted you for the Tailoring Assistant position.',
            time: '20 minutes ago',
            type: 'application',
            read: false
          },
          {
            id: 2,
            title: 'New 94% Matched Job in Varanasi',
            message: 'A new home-stitching vacancy paying ₹8,000–₹12,000 was posted in your district.',
            time: '3 hours ago',
            type: 'job',
            read: false
          },
          {
            id: 3,
            title: 'PM Vishwakarma Scheme Reminder',
            message: 'Free sewing machine toolkit applications are open at your nearest CSC.',
            time: 'Yesterday',
            type: 'scheme',
            read: true
          },
          {
            id: 4,
            title: 'Security Alert: New Login Verified',
            message: 'Your account was accessed via verified OTP on your registered phone number.',
            time: '2 days ago',
            type: 'security',
            read: true
          }
        ]
  );

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  return (
    <div className="container" style={{ maxWidth: '780px', paddingBottom: '60px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
            <Bell size={14} /> Alerts & Updates
          </div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Real-time alerts on applications, job matches, and account security.</p>
        </div>

        <button type="button" className="btn btn-outline btn-sm" onClick={markAllRead}>
          Mark All as Read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="card"
            style={{
              borderLeft: notif.read ? '1px solid var(--border)' : '4px solid var(--primary-700)',
              backgroundColor: notif.read ? '#ffffff' : 'var(--primary-50)'
            }}
          >
            <div className="card-body" style={{ padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: notif.type === 'security' ? 'var(--secondary-50)' : 'var(--primary-100)',
                color: notif.type === 'security' ? 'var(--secondary-700)' : 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {notif.type === 'security' ? <ShieldCheck size={18} /> : <Sparkles size={18} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{notif.title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {notif.time}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{notif.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
