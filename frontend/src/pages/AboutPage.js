import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Brain,
  Award,
  Users,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px' }}>
        <div className="badge badge-primary" style={{ marginBottom: '12px' }}>
          Academic Engineering Research Project
        </div>
        <h1 className="page-title" style={{ fontSize: '36px' }}>
          About Shakti Platform
        </h1>
        <p className="page-subtitle" style={{ margin: '12px auto 0', fontSize: '17px' }}>
          Secured AI-Enabled Platform for Digital Literacy and Career Empowerment for Rural Women in India.
        </p>
      </div>

      {/* Problem Statement & Motivation */}
      <div className="card" style={{ marginBottom: '36px' }}>
        <div className="card-body" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px', color: 'var(--primary-900)' }}>
            The Challenge We Address
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-body)', marginBottom: '16px' }}>
            In rural India, millions of women possess valuable skills such as tailoring, embroidery, handicrafts, organic food processing, and agriculture. However, their participation in the formal economic workforce remains significantly constrained due to:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '6px' }}>1. Digital Literacy Barrier</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Complex, English-heavy apps alienate rural smartphone users who lack formal computer training.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '6px' }}>2. Information Fragmentation</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Over 4,700 central and state schemes exist, but beneficiaries remain unaware of their specific eligibility.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '6px' }}>3. Privacy & Trust Concerns</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Fear of identity misuse, online financial fraud, and unsecured handling of sensitive Aadhaar numbers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Innovation Grid */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>
          Core Technological Innovations
        </h2>

        <div className="grid-3">
          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Hybrid Recommendation Engine</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Combines <strong>TF-IDF vector cosine similarity (60%)</strong> across candidate skills and job descriptions with <strong>multi-criteria eligibility rule evaluation (40%)</strong> covering age, location, income, and education.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--secondary-50)', color: 'var(--secondary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Cryptographic Privacy Layer</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Validates official <strong>UIDAI Verhoeff Checksum</strong> to eliminate typographical errors. Plaintext Aadhaar is never stored; instead, data is sealed with <strong>256-Bit AES-GCM</strong> encryption with blind indexing (HMAC-SHA256).
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--accent-50)', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Two-Sided NGO Ecosystem</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Connects grassroots rural women with certified NGOs and self-help federations (SHGs) offering fair-wage work-from-home stitching, artisan production, and localized vocational training.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Meta & Team */}
      <div className="card" style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-strong)' }}>
        <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Context
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>
              Final Year Engineering Capstone Project
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Department of Computer Engineering • Guided by Faculty Mentors
            </p>
          </div>

          <Link to="/register" className="btn btn-primary">
            <span>Explore Platform</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
