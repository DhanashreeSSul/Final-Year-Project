import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sprout,
  SlidersHorizontal,
  X,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ENTERPRISE_MODELS = [
  {
    id: 'ent-1',
    title: 'Village Tailoring & Boutique Micro-Unit',
    investment: '₹15,000 – ₹25,000 (Covered by PM Vishwakarma)',
    monthlyEarnings: '₹10,000 – ₹16,000/month',
    icon: Scissors,
    baseIncome: 10000,
    maxIncome: 16000,
    color: 'var(--primary-600)',
    steps: [
      'Avail ₹15,000 modern toolkit grant for automatic sewing machine',
      'Enroll in 4-week advanced blouse and kurti pattern design training',
      'Tie up with local SHG federation for school uniform orders',
      'Take collateral-free Mudra Shishu loan (up to ₹50,000) for fabric stock'
    ],
    recommendedScheme: 'PM Vishwakarma + Mudra Shishu',
    schemeLink: '/woman/schemes'
  },
  {
    id: 'ent-2',
    title: 'Organic Food Processing & Spice Blending',
    investment: '₹10,000 – ₹20,000 (FSSAI Support via KVK)',
    monthlyEarnings: '₹8,000 – ₹14,000/month',
    icon: Sprout,
    baseIncome: 8000,
    maxIncome: 14000,
    color: 'var(--teal-500)',
    steps: [
      'Source clean raw turmeric, chili, and millets from village farmers',
      'Receive food safety and packaging training at Krishi Vigyan Kendra',
      'Supply vacuum-sealed packs to nearby weekly markets (Haats) and NGO outlets',
      'Join Lakhpati Didi initiative for collective branding and logistics'
    ],
    recommendedScheme: 'Lakhpati Didi + PMFME Scheme',
    schemeLink: '/woman/schemes'
  },
  {
    id: 'ent-3',
    title: 'Handicraft & Jute Utility Bag Collective',
    investment: '₹5,000 – ₹10,000 (Raw materials provided)',
    monthlyEarnings: '₹7,000 – ₹12,000/month',
    icon: Store,
    baseIncome: 7000,
    maxIncome: 12000,
    color: 'var(--secondary-600)',
    steps: [
      'Connect with artisan partner foundations providing raw yarn and jute',
      'Work flexibly from home on piece-rate orders',
      'Participate in state SARAS fairs and exhibitions',
      'Open Mahila Samman Savings Certificate for 7.5% guaranteed interest'
    ],
    recommendedScheme: 'Deendayal Antyodaya Yojana (DAY-NRLM)',
    schemeLink: '/woman/schemes'
  }
];

/* ─── ROI Calculator ─── */
function ROICalculator({ model }) {
  const [investment, setInvestment] = useState(15000);
  const [hoursPerDay, setHoursPerDay] = useState(5);

  const hoursFactor = hoursPerDay / 8;
  const investFactor = Math.min(1.5, investment / 15000);
  const estimatedMonthly = Math.round(model.baseIncome * hoursFactor * investFactor);
  const bars = [
    { label: 'Month 1', value: Math.round(estimatedMonthly * 0.5) },
    { label: 'Month 3', value: Math.round(estimatedMonthly * 0.8) },
    { label: 'Month 6', value: estimatedMonthly },
    { label: 'Month 12', value: Math.round(estimatedMonthly * 1.25) },
  ];
  const maxBar = Math.max(...bars.map(b => b.value));

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
      borderRadius: '16px', padding: '20px',
      border: '1.5px solid var(--primary-100)', marginTop: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <SlidersHorizontal size={16} color="var(--primary-700)" />
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary-800)' }}>
          ROI Calculator (Estimate)
        </span>
      </div>

      {/* Investment Slider */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Initial Investment</span>
          <span style={{ color: 'var(--primary-700)', fontWeight: '800' }}>₹{investment.toLocaleString()}</span>
        </div>
        <input
          type="range" min="5000" max="50000" step="1000"
          value={investment}
          onChange={(e) => setInvestment(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary-600)' }}
          aria-label="Investment amount slider"
        />
      </div>

      {/* Hours Slider */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Hours per Day</span>
          <span style={{ color: 'var(--primary-700)', fontWeight: '800' }}>{hoursPerDay} hrs</span>
        </div>
        <input
          type="range" min="2" max="10" step="1"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary-600)' }}
          aria-label="Hours per day slider"
        />
      </div>

      {/* Estimated Income */}
      <div style={{
        textAlign: 'center', padding: '14px', borderRadius: '12px',
        background: 'var(--surface)', border: '1.5px solid var(--teal-200)',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Estimated Monthly Income
        </div>
        <motion.div
          key={estimatedMonthly}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ fontSize: '28px', fontWeight: '800', color: 'var(--teal-600)', marginTop: '4px' }}
        >
          ₹{estimatedMonthly.toLocaleString()}
        </motion.div>
        <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>
          * Estimate based on local market rates. Actual income may vary.
        </div>
      </div>

      {/* Mini bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
        {bars.map((bar, idx) => (
          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(bar.value / maxBar) * 60}px` }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              style={{
                width: '100%', borderRadius: '6px 6px 0 0',
                background: idx === bars.length - 1
                  ? 'linear-gradient(180deg, var(--teal-400), var(--teal-600))'
                  : 'linear-gradient(180deg, var(--primary-300), var(--primary-500))',
                minHeight: '8px'
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-light)' }}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WomanEntrepreneurshipPage() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [expandedCalc, setExpandedCalc] = useState(null);

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header">
        <motion.div
          className="badge badge-primary"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '10px' }}
        >
          <Store size={14} /> Micro-Enterprise Hub
        </motion.div>
        <h1 className="page-title">Start Your Own Home Business</h1>
        <p className="page-subtitle">
          Proven enterprise blueprints with step-by-step government financial assistance and NGO raw material linkages.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '40px' }}>
        {ENTERPRISE_MODELS.map((model, idx) => {
          const IconComp = model.icon;
          const isCalcOpen = expandedCalc === model.id;

          return (
            <motion.div
              key={model.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Icon with duotone background */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${model.color}12`,
                  color: model.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '14px', position: 'relative'
                }}>
                  <IconComp size={26} />
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '14px',
                    background: `${model.color}08`,
                    transform: 'rotate(6deg)', pointerEvents: 'none'
                  }} />
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', lineHeight: '1.3' }}>{model.title}</h2>

                <div style={{
                  background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '12px',
                  fontSize: '13px', marginBottom: '14px', border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <IndianRupee size={13} color="var(--text-muted)" />
                    <span>Initial Cost: <strong>{model.investment}</strong></span>
                  </div>
                  <div style={{ color: 'var(--teal-700)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={13} />
                    Est. Income: {model.monthlyEarnings}
                  </div>
                </div>

                {/* Scheme chip links */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  <Link to={model.schemeLink} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '5px 12px', borderRadius: '999px',
                    background: 'var(--secondary-50)', border: '1px solid var(--secondary-200)',
                    fontSize: '11px', fontWeight: '700', color: 'var(--secondary-800)',
                    textDecoration: 'none', transition: 'all 0.2s'
                  }}>
                    <ShieldCheck size={11} /> {model.recommendedScheme}
                  </Link>
                </div>

                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ACTION BLUEPRINT:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
                  {model.steps.map((step, stepIdx) => (
                    <div key={stepIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle2 size={14} color="var(--secondary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* ROI Calculator toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedCalc(isCalcOpen ? null : model.id)}
                  style={{
                    background: isCalcOpen ? 'var(--primary-50)' : 'transparent',
                    border: `1.5px solid ${isCalcOpen ? 'var(--primary-300)' : 'var(--border)'}`,
                    borderRadius: '12px', padding: '10px 14px',
                    cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                    color: 'var(--primary-700)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    width: '100%', justifyContent: 'center',
                    transition: 'all 0.2s', marginBottom: '12px'
                  }}
                >
                  <BarChart3 size={14} />
                  {isCalcOpen ? 'Hide Calculator' : 'ROI Calculator'}
                </button>

                <AnimatePresence>
                  {isCalcOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <ROICalculator model={model} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
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
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(31, 22, 48, 0.65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 9999, padding: '20px'
            }}
            onClick={() => setSelectedModel(null)}
          >
            <motion.div
              className="card"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ maxWidth: '560px', width: '100%', padding: '28px', backgroundColor: 'var(--surface)' }}
              onClick={(e) => e.stopPropagation()}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
