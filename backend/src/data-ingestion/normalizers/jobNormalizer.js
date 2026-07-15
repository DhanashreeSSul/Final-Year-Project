/**
 * Job Normalizer — transforms raw source data into the jobs table schema.
 * Does NOT invent missing fields. Uses NULL for unknown values.
 */

/**
 * Normalize a raw job record from any source.
 * @param {object} raw - Raw source record
 * @param {object} sourceMeta - Source metadata { sourceName, sourceUrl, sourceType, ... }
 * @returns {object} - Normalized job record matching jobs table columns
 */
function normalizeJob(raw, sourceMeta) {
    return {
        title: cleanString(raw.title || raw.job_title || raw.post_name || raw.designation),
        description: cleanString(raw.description || raw.job_description || raw.details || ''),
        job_type: mapJobType(raw.job_type || raw.employment_type || raw.type),
        work_mode: mapWorkMode(raw.work_mode || raw.mode_of_work),
        location_state: cleanString(raw.state || raw.location_state || raw.state_name),
        location_district: cleanString(raw.district || raw.location_district || raw.district_name),
        salary_min: parseNumber(raw.salary_min || raw.min_salary || raw.salary_from),
        salary_max: parseNumber(raw.salary_max || raw.max_salary || raw.salary_to),
        skills_required: parseArrayField(raw.skills_required || raw.skills || raw.key_skills),
        education_required: cleanString(raw.education_required || raw.qualification || raw.education),
        language_required: parseArrayField(raw.language_required || raw.languages),
        application_deadline: parseDate(raw.application_deadline || raw.last_date || raw.deadline),
        seats: parseNumber(raw.seats || raw.vacancies || raw.no_of_posts),
        category: cleanString(raw.category || raw.sector || raw.industry),
        posted_date: parseDate(raw.posted_date || raw.publish_date || raw.date_posted),
        external_application_url: cleanUrl(raw.external_application_url || raw.apply_url || raw.application_link),
        // Source provenance
        source_name: sourceMeta.sourceName || null,
        source_url: sourceMeta.sourceUrl || null,
        source_record_id: raw.source_record_id || raw.id || raw.record_id || null,
        source_type: sourceMeta.sourceType || null,
        source_dataset_name: sourceMeta.datasetName || null,
        source_dataset_id: sourceMeta.datasetId || null,
        source_api_url: sourceMeta.apiUrl || null,
        last_verified_at: new Date(),
        imported_at: new Date(),
        data_status: 'active',
        is_official_source: sourceMeta.isOfficialSource === true,
        is_active: true,
    };
}

function cleanString(val) {
    if (!val) return null;
    return String(val).trim().replace(/\s+/g, ' ') || null;
}

function parseNumber(val) {
    if (val === null || val === undefined || val === '') return null;
    const n = parseInt(val, 10);
    return isNaN(n) ? null : n;
}

function parseDate(val) {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

function parseArrayField(val) {
    if (!val) return null;
    if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
    // Handle comma-separated strings
    if (typeof val === 'string') {
        const items = val.split(',').map(v => v.trim()).filter(Boolean);
        return items.length > 0 ? items : null;
    }
    return null;
}

function cleanUrl(val) {
    if (!val) return null;
    const url = String(val).trim();
    try {
        const parsed = new URL(url);
        if (['http:', 'https:'].includes(parsed.protocol)) return url;
    } catch { }
    return null;
}

function mapJobType(val) {
    if (!val) return null;
    const lower = String(val).toLowerCase().trim();
    const map = {
        'full-time': 'full-time', 'fulltime': 'full-time', 'full time': 'full-time',
        'part-time': 'part-time', 'parttime': 'part-time', 'part time': 'part-time',
        'contract': 'contract', 'contractual': 'contract',
        'internship': 'internship', 'intern': 'internship',
        'temporary': 'contract', 'temp': 'contract',
        'freelance': 'contract',
    };
    return map[lower] || cleanString(val);
}

function mapWorkMode(val) {
    if (!val) return null;
    const lower = String(val).toLowerCase().trim();
    const map = {
        'remote': 'remote', 'work from home': 'remote', 'wfh': 'remote',
        'onsite': 'onsite', 'on-site': 'onsite', 'office': 'onsite', 'on site': 'onsite',
        'hybrid': 'hybrid',
    };
    return map[lower] || cleanString(val);
}

module.exports = { normalizeJob };
