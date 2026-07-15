/**
 * Course Normalizer — transforms raw source data into the courses table schema.
 */

function normalizeCourse(raw, sourceMeta) {
    return {
        title: cleanString(raw.title || raw.course_name || raw.program_name),
        description: cleanString(raw.description || raw.course_description || raw.about || ''),
        duration: cleanString(raw.duration || raw.course_duration),
        mode: mapMode(raw.mode || raw.delivery_mode || raw.type),
        language: parseArrayField(raw.language || raw.languages || raw.medium),
        skills_taught: parseArrayField(raw.skills_taught || raw.skills || raw.key_skills),
        certification: parseBool(raw.certification || raw.certificate),
        is_free: parseFreeStatus(raw.is_free, raw.fee, raw.price, raw.cost),
        fee: parseNumber(raw.fee || raw.price || raw.cost),
        location_state: cleanString(raw.state || raw.location_state),
        location_district: cleanString(raw.district || raw.location_district),
        start_date: parseDate(raw.start_date),
        end_date: parseDate(raw.end_date),
        seats: parseNumber(raw.seats || raw.capacity),
        category: cleanString(raw.category || raw.sector || raw.domain),
        external_course_url: cleanUrl(raw.external_course_url || raw.course_url || raw.url),
        registration_url: cleanUrl(raw.registration_url || raw.enroll_url || raw.apply_url),
        provider_type: cleanString(raw.provider_type || raw.institution_type),
        // Source provenance
        source_name: sourceMeta.sourceName || null,
        source_url: sourceMeta.sourceUrl || null,
        source_record_id: raw.source_record_id || raw.id || raw.record_id || null,
        source_type: sourceMeta.sourceType || null,
        source_dataset_name: sourceMeta.datasetName || null,
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

/**
 * Only mark as free if explicitly indicated.
 * Do NOT assume free when price/fee is missing.
 */
function parseFreeStatus(isFree, fee, price, cost) {
    // Explicit boolean
    if (isFree === true || isFree === 'true' || isFree === 'yes' || isFree === 'Yes') return true;
    if (isFree === false || isFree === 'false' || isFree === 'no' || isFree === 'No') return false;
    // If fee is explicitly 0
    const numFee = parseNumber(fee) || parseNumber(price) || parseNumber(cost);
    if (numFee === 0) return true;
    // Unknown — do not assume free
    return null;
}

function parseBool(val) {
    if (val === true || val === 'true' || val === 'yes' || val === 'Yes' || val === '1') return true;
    if (val === false || val === 'false' || val === 'no' || val === 'No' || val === '0') return false;
    return null;
}

function mapMode(val) {
    if (!val) return null;
    const lower = String(val).toLowerCase().trim();
    const map = {
        'online': 'online', 'virtual': 'online', 'e-learning': 'online',
        'offline': 'offline', 'classroom': 'offline', 'in-person': 'offline',
        'hybrid': 'hybrid', 'blended': 'hybrid',
    };
    return map[lower] || cleanString(val);
}

module.exports = { normalizeCourse };
