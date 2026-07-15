/**
 * Deduplication utilities for data ingestion.
 * Uses SHA-256 fingerprints for records without a source_record_id.
 */
const crypto = require('crypto');

/**
 * Generate a deterministic fingerprint from stable fields.
 * @param {object} fields - Key-value pairs to fingerprint
 * @returns {string} - SHA-256 hex digest
 */
function generateFingerprint(fields) {
    const normalized = Object.entries(fields)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${normalizeValue(v)}`)
        .join('|');
    return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalize a value for fingerprinting.
 */
function normalizeValue(val) {
    if (val === null || val === undefined) return '';
    return String(val).toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Generate a job fingerprint.
 * Uses: title + company/org + location + source_name
 */
function jobFingerprint(record) {
    return generateFingerprint({
        title: record.title,
        company: record.company_name || record.org_name || '',
        location: `${record.location_state || ''}:${record.location_district || ''}`,
        source: record.source_name || '',
    });
}

/**
 * Generate a course fingerprint.
 * Uses: title + provider + source_name
 */
function courseFingerprint(record) {
    return generateFingerprint({
        title: record.title,
        provider: record.provider || record.org_name || '',
        source: record.source_name || '',
    });
}

/**
 * Generate a scheme fingerprint.
 * Uses: title + ministry + source_name
 */
function schemeFingerprint(record) {
    return generateFingerprint({
        title: record.title,
        ministry: record.ministry || '',
        source: record.source_name || '',
    });
}

module.exports = {
    generateFingerprint,
    jobFingerprint,
    courseFingerprint,
    schemeFingerprint,
};
