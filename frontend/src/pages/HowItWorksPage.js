import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  UserCheck,
  CheckCircle2,
  Brain,
  Sliders,
  TrendingUp,
  Building2,
  FileCheck2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
        <div className="badge badge-primary" style={{ marginBottom: '12px' }}>
          Platform Walkthrough
        </div>
        <h1 className="page-title" style={{ fontSize: '36px' }}>
          How Shakti Platform Works
        </h1>
        <p className="page-subtitle" style={{ margin: '12px auto 0', fontSize: '17px' }}>
          Designed for simplicity, transparency, and high precision matching between rural talent and verified opportunities.
        </p>
      </div>

      {/* 4 Steps in Detail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '56px' }}>
        {/* Step 1 */}
        <div className="card">
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '10px' }}>Step 1</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>
                Simple & Trustworthy Profile Creation
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Rural women register using their active mobile number and select their home state, district, and village. Identity can be verified via official UIDAI Verhoeff Checksum, ensuring maximum privacy without ever storing unencrypted numbers.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                <span className="badge badge-neutral"><ShieldCheck size={13} /> Verhoeff Validation</span>
                <span className="badge badge-neutral"><ShieldCheck size={13} /> 256-bit AES-GCM</span>
                <span className="badge badge-neutral"><ShieldCheck size={13} /> Masked Display</span>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '8px' }}>
                Beneficiary Privacy Guarantee
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Your phone number and exact village address are never made public. Only verified NGO partners reviewing an active application can communicate with you.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="card">
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '10px' }}>Step 2</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>
                Visual Skills & Interest Selection
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                No complicated forms. Users select high-contrast visual cards representing their everyday skills: Tailoring, Handicrafts, Agriculture, Teaching, Small Business, or Food Processing.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                <span className="badge badge-primary">Tailoring</span>
                <span className="badge badge-primary">Handicrafts</span>
                <span className="badge badge-primary">Agriculture</span>
                <span className="badge badge-primary">Cooking</span>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '8px' }}>
                Zero Jargon Interface
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Icons and voice-assisted prompts allow women with limited schooling to specify their exact work preferences (e.g., Work From Home vs Village Common Service Center).
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="card">
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '10px' }}>Step 3</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>
                Explainable AI Matching Engine
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Our hybrid recommendation engine computes compatibility scores using a two-stage evaluation:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', fontSize: '14px', color: 'var(--text-body)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--secondary-600)" />
                  <span><strong>60% Weight:</strong> TF-IDF cosine similarity of candidate skill profiles against opportunity texts.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--secondary-600)" />
                  <span><strong>40% Weight:</strong> Multi-criteria constraint validation (District/State, minimum age, education, and work mode).</span>
                </li>
              </ul>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '8px' }}>
                Why Explainability Matters
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Every recommendation clearly states: <em>"Why does this match you?"</em> showing skill score, distance proximity, and wage alignment so beneficiaries trust the results.
              </p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="card">
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '10px' }}>Step 4</div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>
                Application Tracking & Career Roadmap
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Women can apply in one click. Applications move through transparent stages: <em>Applied ➔ Under Review ➔ Shortlisted ➔ Interview ➔ Selected</em>. Progress is automatically mapped onto the beneficiary's personalized career roadmap.
              </p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/register" className="btn btn-primary">
                  <span>Get Started Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-800)', marginBottom: '8px' }}>
                Transparent Status Tracking
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                No silent rejections. Applicants receive clear feedback and next-step recommendations if additional skill training is required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
