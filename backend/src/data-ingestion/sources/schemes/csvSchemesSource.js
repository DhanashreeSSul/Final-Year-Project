/**
 * CSV Schemes Source Adapter
 */
const path = require('path');
const { parseCSV, readSourceMeta, listCSVFiles } = require('../../utils/csvParser');
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });

const DEFAULT_DIR = path.join(__dirname, '../../../../data/official/schemes');

async function fetchRecords() {
    const dataDir = process.env.OFFICIAL_DATA_DIR
        ? path.join(process.env.OFFICIAL_DATA_DIR, 'schemes')
        : DEFAULT_DIR;

    const csvFiles = listCSVFiles(dataDir);
    if (csvFiles.length === 0) {
        console.log('ℹ️  [CSV Schemes] No CSV files found in', dataDir);
        return { records: [], meta: { sourceName: 'CSV Import', sourceType: 'csv' } };
    }

    const allRecords = [];
    for (const file of csvFiles) {
        console.log(`📄 [CSV Schemes] Parsing: ${path.basename(file)}`);
        const meta = readSourceMeta(file) || { sourceName: 'Official CSV Import', isOfficialSource: false };
        try {
            const rows = await parseCSV(file);
            const records = rows.map(r => ({
                ...r,
                _sourceMeta: {
                    sourceName: meta.sourceName || 'CSV Import',
                    sourceUrl: meta.sourceUrl || '',
                    sourceType: 'csv',
                    datasetName: meta.datasetName || path.basename(file, '.csv'),
                    isOfficialSource: meta.isOfficialSource === true,
                },
            }));
            allRecords.push(...records);
        } catch (err) {
            console.error(`❌ [CSV Schemes] Failed to parse ${path.basename(file)}: ${err.message}`);
        }
    }

    return { records: allRecords, meta: { sourceName: 'CSV Import', sourceType: 'csv' } };
}

module.exports = { sourceName: 'CSV Import', sourceType: 'schemes', fetchRecords };
