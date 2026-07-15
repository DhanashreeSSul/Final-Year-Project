/**
 * Validation utilities for data ingestion.
 * Validates records before database insertion.
 */

/**
 * Validate a URL string.
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

/**
 * Validate a job record before insertion.
 * Returns { valid: boolean, errors: string[] }
 */
function validateJob(record) {
    const errors = [];

    if (!record.title || !record.title.trim()) {
        errors.push('title is required');
    }
    if (!record.source_name) {
        errors.push('source_name is required');
    }
    if (!record.source_url && !record.source_dataset_name) {
        errors.push('source_url or source_dataset_name is required');
    }
    if (record.external_application_url && !isValidUrl(record.external_application_url)) {
        errors.push('external_application_url is not a valid URL');
    }
    if (record.source_url && !isValidUrl(record.source_url)) {
        errors.push('source_url is not a valid URL');
    }
    // Do not allow synthetic records
    if (record._synthetic === true) {
        errors.push('synthetic records are not allowed');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate a course record before insertion.
 */
function validateCourse(record) {
    const errors = [];

    if (!record.title || !record.title.trim()) {
        errors.push('title is required');
    }
    if (!record.source_name && !record.provider) {
        errors.push('source_name or provider is required');
    }
    if (!record.source_url && !record.source_dataset_name) {
        errors.push('source provenance is required (source_url or source_dataset_name)');
    }
    if (record.external_course_url && !isValidUrl(record.external_course_url)) {
        errors.push('external_course_url is not a valid URL');
    }
    if (record._synthetic === true) {
        errors.push('synthetic records are not allowed');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate a scheme record before insertion.
 */
function validateScheme(record) {
    const errors = [];

    if (!record.title || !record.title.trim()) {
        errors.push('title is required');
    }
    if (!record.source_name && !record.source_url) {
        errors.push('source provenance is required');
    }
    if (record.official_application_url && !isValidUrl(record.official_application_url)) {
        errors.push('official_application_url is not a valid URL');
    }
    if (record.official_scheme_url && !isValidUrl(record.official_scheme_url)) {
        errors.push('official_scheme_url is not a valid URL');
    }
    if (record._synthetic === true) {
        errors.push('synthetic records are not allowed');
    }

    return { valid: errors.length === 0, errors };
}

module.exports = { validateJob, validateCourse, validateScheme, isValidUrl };
