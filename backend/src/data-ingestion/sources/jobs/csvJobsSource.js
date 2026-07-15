/**
 * CSV Jobs Source Adapter
 * 
 * Imports jobs from official CSV files placed in the configured
 * official data directory: data/official/jobs/
 * 
 * Each CSV file must have a companion _meta.json with source provenance.
 */
const path = require('path');
const { parseCSV, readSourceMeta, listCSVFiles } = require('../../utils/csvParser');
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });

const DEFAULT_DIR = path.join(__dirname, '../../../../data/official/jobs');

async function fetchRecords() {
    const dataDir = process.env.OFFICIAL_DATA_DIR
        ? path.join(process.env.OFFICIAL_DATA_DIR, 'jobs')
        : DEFAULT_DIR;

    const csvFiles = listCSVFiles(dataDir);

    if (csvFiles.length === 0) {
        console.log('ℹ️  [CSV Jobs] No CSV files found in', dataDir);
        return { records: [], meta: { sourceName: 'CSV Import', sourceType: 'csv' } };
    }

    const allRecords = [];

    for (const file of csvFiles) {
        console.log(`📄 [CSV Jobs] Parsing: ${path.basename(file)}`);
        const meta = readSourceMeta(file) || {
            sourceName: 'Official CSV Import',
            sourceUrl: '',
            isOfficialSource: false, // Not auto-classified as official
        };

        try {
            const rows = await parseCSV(file);
            const records = rows.map(r => ({
                ...r,
                _sourceMeta: {
                    sourceName: meta.sourceName || 'CSV Import',
                    sourceUrl: meta.sourceUrl || meta.datasetUrl || '',
                    sourceType: 'csv',
                    datasetName: meta.datasetName || path.basename(file, '.csv'),
                    datasetId: meta.datasetId || null,
                    isOfficialSource: meta.isOfficialSource === true,
                },
            }));
            allRecords.push(...records);
        } catch (err) {
            console.error(`❌ [CSV Jobs] Failed to parse ${path.basename(file)}: ${err.message}`);
        }
    }

    return {
        records: allRecords,
        meta: { sourceName: 'CSV Import', sourceType: 'csv' },
    };
}

module.exports = {
    sourceName: 'CSV Import',
    sourceType: 'jobs',
    fetchRecords,
};
