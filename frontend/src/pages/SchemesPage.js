import React, { useState, useEffect, useCallback } from 'react';
import { DEMO_SCHEMES } from '../utils/demoData';
import { schemesAPI } from '../utils/api';
import {
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileCheck2,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  MapPin,
  ListChecks,
  Info,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Women and Child', label: 'Women & Child Development' },
  { value: 'Social welfare & Empowerment', label: 'Social Welfare & Empowerment' },
  { value: 'Education & Learning', label: 'Education & Learning' },
  { value: 'Agriculture,Rural & Environment', label: 'Agriculture & Rural Livelihoods' },
  { value: 'Business & Entrepreneurship', label: 'Business & Entrepreneurship' },
  { value: 'Skills & Employment', label: 'Skills & Employment' },
  { value: 'Health & Wellness', label: 'Health & Wellness' },
  { value: 'Banking,Financial Services and Insurance', label: 'Financial Services & Loans' },
  { value: 'Housing & Shelter', label: 'Housing & Shelter' }
];

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [totalSchemes, setTotalSchemes] = useState(4710);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [eligibleModalScheme, setEligibleModalScheme] = useState(null);

  const fetchSchemes = useCallback(async (pageNum = 1, cat = 'all', query = '') => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit,
        category: cat !== 'all' ? cat : undefined,
        search: query.trim() ? query.trim() : undefined
      };
      const res = await schemesAPI.getAll(params);
      const schemeList = res.data?.data;
      const totalCount = res.data?.total;

      if (Array.isArray(schemeList) && schemeList.length > 0) {
        setSchemes(schemeList);
        if (typeof totalCount === 'number') {
          setTotalSchemes(totalCount);
        }
      } else {
        // If empty on search, set empty schemes
        setSchemes([]);
        if (typeof totalCount === 'number') setTotalSchemes(totalCount);
      }
    } catch (err) {
      console.warn('Backend schemes fallback:', err.message);
      // Fallback to demo schemes if completely offline
      setSchemes(DEMO_SCHEMES);
      setTotalSchemes(DEMO_SCHEMES.length);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever page or selectedCategory changes
  useEffect(() => {
    fetchSchemes(page, selectedCategory, searchQuery);
  }, [page, selectedCategory, fetchSchemes]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchSchemes(1, selectedCategory, searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, fetchSchemes]);

  const totalPages = Math.max(1, Math.ceil(totalSchemes / limit));

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div className="page-header">
        <div className="badge badge-primary" style={{ marginBottom: '10px' }}>
          <FileCheck2 size={14} /> Official Government Initiatives
        </div>
        <h1 className="page-title">Verified Government Schemes & Financial Grants</h1>
        <p className="page-subtitle">
          Direct database connection to {totalSchemes.toLocaleString()}+ verified Central & State schemes for rural women empowerment, enterprise loans, and skill toolkits.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-body" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search 4,710+ schemes (e.g. Mudra, Vishwakarma, Lakhpati Didi, Matru Vandana)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '44px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: 'auto', minWidth: '220px' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-700)', padding: '6px 12px', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-full)' }}>
            {totalSchemes.toLocaleString()} Schemes Found
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--primary-700)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Querying scheme database...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Info size={36} color="var(--primary-600)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No matching schemes found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 16px' }}>
            Try adjusting your search terms or category filter to discover more of our 4,710+ verified initiatives.
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {schemes.map((scheme) => {
            const summaryText = scheme.benefits || scheme.description || 'Verified government initiative providing financial assistance and welfare benefits.';

            return (
              <div
                key={scheme.id}
                className="card card-hover-lift"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '11px' }}>
                      {scheme.category || 'Government Scheme'}
                    </span>
                    {scheme.state && (
                      <span className="badge badge-neutral" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                        <MapPin size={11} /> {scheme.state === 'All' ? 'All India' : scheme.state}
                      </span>
                    )}
                  </div>

                  {/* Title & Ministry */}
                  <h3
                    className="line-clamp-2"
                    title={scheme.title}
                    style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.35', marginBottom: '6px' }}
                  >
                    {scheme.title}
                  </h3>

                  {scheme.ministry && (
                    <div className="line-clamp-1" style={{ fontSize: '12px', color: 'var(--primary-800)', fontWeight: '600', marginBottom: '12px' }}>
                      {scheme.ministry}
                    </div>
                  )}

                  {/* Concise 2-Line Overview (No heavy nested box) */}
                  <p
                    className="line-clamp-2"
                    style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '16px' }}
                  >
                    {summaryText}
                  </p>

                  {/* Quick Feature Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                      <CheckCircle2 size={11} color="var(--secondary-600)" /> Verified Scheme
                    </span>
                    {scheme.documents_required && (
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        <FileText size={11} /> Checklist Ready
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setEligibleModalScheme(scheme)}
                      style={{ flex: 1 }}
                    >
                      <Info size={14} />
                      <span>View Details</span>
                    </button>

                    <a
                      href={scheme.application_link || scheme.official_scheme_url || 'https://www.myscheme.gov.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <ExternalLink size={14} />
                      <span>Apply Now</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '36px' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Comprehensive Details Modal ("After going details show it") */}
      {eligibleModalScheme && (
        <div className="detail-modal-backdrop" onClick={() => setEligibleModalScheme(null)}>
          <div
            className="detail-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px' }}
          >
            {/* Modal Header */}
            <div className="detail-modal-header">
              <button
                type="button"
                onClick={() => setEligibleModalScheme(null)}
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
                <span className="badge badge-primary" style={{ fontSize: '12px' }}>
                  {eligibleModalScheme.category || 'Official Scheme'}
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '12px' }}>
                  <MapPin size={12} /> {eligibleModalScheme.state === 'All' ? 'All India' : eligibleModalScheme.state || 'National'}
                </span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                {eligibleModalScheme.title}
              </h2>

              {eligibleModalScheme.ministry && (
                <div style={{ fontSize: '13px', color: 'var(--primary-800)', fontWeight: '600', marginTop: '6px' }}>
                  {eligibleModalScheme.ministry}
                </div>
              )}
            </div>

            {/* Modal Body with Full In-Depth Details */}
            <div className="detail-modal-body">
              {/* Section 1: Key Benefits & Purpose */}
              <div>
                <div className="detail-section-title">
                  <Award size={16} color="var(--secondary-600)" />
                  <span>Key Benefits & Coverage</span>
                </div>
                <div style={{
                  backgroundColor: 'var(--secondary-50)',
                  border: '1px solid var(--secondary-100)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: '14px',
                  color: 'var(--text-body)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line'
                }}>
                  {eligibleModalScheme.benefits || eligibleModalScheme.description}
                </div>
              </div>

              {/* Section 2: Full Eligibility Criteria */}
              {eligibleModalScheme.eligibility_criteria && (
                <div>
                  <div className="detail-section-title">
                    <CheckCircle2 size={16} color="var(--primary-700)" />
                    <span>Eligibility Criteria</span>
                  </div>
                  <div style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    fontSize: '13px',
                    color: 'var(--text-body)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {eligibleModalScheme.eligibility_criteria}
                  </div>
                </div>
              )}

              {/* Section 3: Required Documents Checklist */}
              {eligibleModalScheme.documents_required && (
                <div>
                  <div className="detail-section-title">
                    <FileCheck2 size={16} color="var(--accent-600)" />
                    <span>Documents to Keep Ready</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(Array.isArray(eligibleModalScheme.documents_required)
                      ? eligibleModalScheme.documents_required
                      : String(eligibleModalScheme.documents_required).replace(/[{}]/g, '').split(',')
                    ).map((doc, idx) => {
                      const trimmed = String(doc).trim();
                      if (!trimmed) return null;
                      return (
                        <span
                          key={idx}
                          className="badge badge-neutral"
                          style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#ffffff', border: '1px solid var(--border)' }}
                        >
                          <CheckCircle2 size={13} color="var(--secondary-600)" />
                          <span>{trimmed}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 4: Step-by-Step How to Apply */}
              {eligibleModalScheme.how_to_apply && (
                <div>
                  <div className="detail-section-title">
                    <Sparkles size={16} color="var(--primary-700)" />
                    <span>How to Apply</span>
                  </div>
                  <div style={{
                    backgroundColor: 'var(--primary-50)',
                    border: '1px solid var(--primary-100)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    fontSize: '13px',
                    color: 'var(--text-body)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {eligibleModalScheme.how_to_apply}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="detail-modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setEligibleModalScheme(null)}
                style={{ flex: 1 }}
              >
                Close
              </button>
              <a
                href={eligibleModalScheme.application_link || eligibleModalScheme.official_scheme_url || 'https://www.myscheme.gov.in'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1.5 }}
              >
                <ExternalLink size={15} /> Apply on Official Portal
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
