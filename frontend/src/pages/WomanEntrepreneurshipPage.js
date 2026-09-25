import React, { useState } from 'react';
import {
  Store,
  Sparkles,
  IndianRupee,
  CheckCircle2,
  ExternalLink,
  Users,
  ShieldCheck,
  TrendingUp,
  FileText,
  Building2,
  Scissors,
  Sprout
} from 'lucide-react';
import toast from 'react-hot-toast';

const ENTERPRISE_MODELS = [
  {
    id: 'ent-1',
    title: 'Village Tailoring & Boutique Micro-Unit',
    investment: '₹15,000 – ₹25,000 (Covered by PM Vishwakarma)',
    monthlyEarnings: '₹10,000 – ₹16,000/month',
    icon: Scissors,
    steps: [
      'Avail ₹15,000 modern toolkit grant for automatic sewing machine',
      'Enroll in 4-week advanced blouse and kurti pattern design training',
      'Tie up with local SHG federation for school uniform orders',
      'Take collateral-free Mudra Shishu loan (up to ₹50,000) for fabric stock'
    ],
    recommendedScheme: 'PM Vishwakarma + Mudra Shishu'
  },
  {
    id: 'ent-2',
    title: 'Organic Food Processing & Spice Blending',
    investment: '₹10,000 – ₹20,000 (FSSAI Support via KVK)',
    monthlyEarnings: '₹8,000 – ₹14,000/month',
    icon: Sprout,
    steps: [
      'Source clean raw turmeric, chili, and millets from village farmers',
      'Receive food safety and packaging training at Krishi Vigyan Kendra',
      'Supply vacuum-sealed packs to nearby weekly markets (Haats) and NGO outlets',
      'Join Lakhpati Didi initiative for collective branding and logistics'
    ],
    recommendedScheme: 'Lakhpati Didi + PMFME Scheme'
  },
  {
    id: 'ent-3',
    title: 'Handicraft & Jute Utility Bag Collective',
    investment: '₹5,000 – ₹10,000 (Raw materials provided)',
    monthlyEarnings: '₹7,000 – ₹12,000/month',
    icon: Store,
    steps: [
      'Connect with artisan partner foundations providing raw yarn and jute',
      'Work flexibly from home on piece-rate orders',
      'Participate in state SARAS fairs and exhibitions',
      'Open Mahila Samman Savings Certificate for 7.5% guaranteed interest'
    ],
    recommendedScheme: 'Deendayal Antyodaya Yojana (DAY-NRLM)'
  }
];

export default function WomanEntrepreneurshipPage() {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header">
        <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
          <Store size={14} /> Micro-Enterprise Hub
        </div>
        <h1 className="page-title">Start Your Own Home Business</h1>
        <p className="page-subtitle">
          Proven enterprise blueprints with step-by-step government financial assistance and NGO raw material linkages.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '40px' }}>
        {ENTERPRISE_MODELS.map((model) => {
          const IconComp = model.icon;
          return (
            <div key={model.id} className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <IconComp size={24} />
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{model.title}</h2>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '14px' }}>
                  <div>Initial Cost: <strong>{model.investment}</strong></div>
                  <div style={{ color: 'var(--secondary-700)', fontWeight: '700', marginTop: '4px' }}>
                    Est. Income: {model.monthlyEarnings}
                  </div>
                </div>

                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-light)', marginBottom: '8px' }}>
                  ACTION BLUEPRINT:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '13px' }}>
                  {model.steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle2 size={14} color="var(--secondary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => {
                      setSelectedModel(model);
                      toast.success(`Toolkit guide opened for ${model.title}`);
                    }}
                  >
                    View Enterprise Guide
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedModel && (
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
          <div className="card" style={{ maxWidth: '560px', width: '100%', padding: '28px', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>
              {selectedModel.title}
            </h2>
            <div className="badge badge-secondary" style={{ marginBottom: '16px' }}>
              Linked Scheme: {selectedModel.recommendedScheme}
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
              To get started, Shakti connects your registered profile with the local District Industries Centre (DIC) and verified NGO collection hubs. You will receive SMS alerts with batch dates.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedModel(null)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  toast.success('Your interest has been logged with your local Gram Panchayat cluster coordinator!');
                  setSelectedModel(null);
                }}
                style={{ flex: 1 }}
              >
                Request Assistance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
