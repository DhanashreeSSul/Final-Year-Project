/**
 * data.gov.in Schemes Source Adapter
 */
const { fetchJSON } = require('../../utils/httpClient');
require('dotenv').config({ path: require('path').join(__dirname, '../../../../.env') });

const SOURCE_META = {
    sourceName: 'Open Government Data Platform India',
    sourceType: 'api',
    sourceUrl: 'https://data.gov.in',
    isOfficialSource: true,
};

async function fetchRecords() {
    const apiKey = process.env.DATA_GOV_API_KEY;
    const resourceId = process.env.DATA_GOV_RESOURCE_SCHEMES;

    if (!apiKey) {
        console.warn('⚠️  [data.gov.in Schemes] DATA_GOV_API_KEY not configured. Skipping.');
        return { records: [], meta: SOURCE_META };
    }

    if (!resourceId) {
        console.warn('⚠️  [data.gov.in Schemes] DATA_GOV_RESOURCE_SCHEMES not configured. Skipping.');
        return { records: [], meta: SOURCE_META };
    }

    try {
        const apiUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&offset=0&limit=500`;
        const response = await fetchJSON(apiUrl);
        const records = (response.records || []).map(r => ({
            ...r,
            source_record_id: r.id || r.sno || null,
        }));

        return {
            records,
            meta: {
                ...SOURCE_META,
                datasetName: response.title || 'data.gov.in Scheme Dataset',
                datasetId: resourceId,
                apiUrl: `https://api.data.gov.in/resource/${resourceId}`,
            },
        };
    } catch (err) {
        console.error(`❌ [data.gov.in Schemes] Failed to fetch: ${err.message}`);
        return { records: [], meta: SOURCE_META, error: err.message };
    }
}

module.exports = { sourceName: SOURCE_META.sourceName, sourceType: 'schemes', fetchRecords };
