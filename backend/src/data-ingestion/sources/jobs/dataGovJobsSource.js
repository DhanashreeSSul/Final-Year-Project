/**
 * data.gov.in Jobs Source Adapter
 * 
 * Uses the Open Government Data Platform India REST API.
 * Requires DATA_GOV_API_KEY environment variable.
 * 
 * Source: https://data.gov.in
 * API format: https://api.data.gov.in/resource/{RESOURCE_ID}?api-key=KEY&format=json
 */
const { fetchJSON } = require('../../utils/httpClient');
require('dotenv').config({ path: require('path').join(__dirname, '../../../../.env') });

const SOURCE_META = {
    sourceName: 'Open Government Data Platform India',
    sourceType: 'api',
    sourceUrl: 'https://data.gov.in',
    isOfficialSource: true,
};

/**
 * Fetch job records from data.gov.in
 * The user must configure DATA_GOV_RESOURCE_JOBS with a valid resource ID.
 */
async function fetchRecords() {
    const apiKey = process.env.DATA_GOV_API_KEY;
    const resourceId = process.env.DATA_GOV_RESOURCE_JOBS;

    if (!apiKey) {
        console.warn('⚠️  [data.gov.in Jobs] DATA_GOV_API_KEY not configured. Skipping.');
        return { records: [], meta: SOURCE_META };
    }

    if (!resourceId) {
        console.warn('⚠️  [data.gov.in Jobs] DATA_GOV_RESOURCE_JOBS not configured. Skipping.');
        console.warn('   To use this source, find a job dataset on data.gov.in and set the resource ID.');
        return { records: [], meta: SOURCE_META };
    }

    try {
        const apiUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&offset=0&limit=500`;
        const response = await fetchJSON(apiUrl);

        const records = (response.records || []).map(r => ({
            ...r,
            source_record_id: r.id || r.sno || r.sr_no || null,
        }));

        return {
            records,
            meta: {
                ...SOURCE_META,
                datasetName: response.title || 'data.gov.in Job Dataset',
                datasetId: resourceId,
                apiUrl: `https://api.data.gov.in/resource/${resourceId}`,
            },
        };
    } catch (err) {
        console.error(`❌ [data.gov.in Jobs] Failed to fetch: ${err.message}`);
        return { records: [], meta: SOURCE_META, error: err.message };
    }
}

module.exports = {
    sourceName: SOURCE_META.sourceName,
    sourceType: 'jobs',
    fetchRecords,
};
