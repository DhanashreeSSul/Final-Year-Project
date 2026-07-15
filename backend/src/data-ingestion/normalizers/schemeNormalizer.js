/**
 * Scheme Normalizer — transforms raw source data into the schemes table schema.
 * Government scheme facts come ONLY from source data. Nothing fabricated.
 */

function normalizeScheme(raw, sourceMeta) {
    return {
        title: cleanString(raw.title || raw.scheme_name || raw.name),
        description: cleanString(raw.description || raw.scheme_description || raw.about || ''),
        scheme_type: cleanString(raw.scheme_type || raw.type || raw.category_type),
        ministry: cleanString(raw.ministry || raw.department || raw.implementing_agency),
        eligibility_criteria: cleanString(raw.eligibility_criteria || raw.eligibility || raw.who_can_apply),
        benefits: cleanString(raw.benefits || raw.benefit_description || raw.what_you_get),
        how_to_apply: cleanString(raw.how_to_apply || raw.application_process || raw.steps),
        documents_required: parseArrayField(raw.documents_required || raw.documents || raw.docs),
        state: cleanString(raw.state || raw.applicable_state || 'All'),
        category: cleanString(raw.category || raw.sector || raw.domain),
        application_link: cleanUrl(raw.application_link || raw.apply_url || raw.official_url),
        official_application_url: cleanUrl(raw.official_application_url || raw.apply_url),
        official_scheme_url: cleanUrl(raw.official_scheme_url || raw.scheme_url || raw.url),
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

function parseArrayField(val) {
    if (!val) return null;
    if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
    if (typeof val === 'string') {
        // Handle newline-separated or comma-separated
        const items = val.split(/[,\n]/).map(v => v.trim().replace(/^[-•]\s*/, '')).filter(Boolean);
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

module.exports = { normalizeScheme };
