/**
 * Sync Schemes — orchestrates scheme data ingestion from all configured sources.
 */
const { normalizeScheme } = require('./normalizers/schemeNormalizer');
const { validateScheme } = require('./utils/validation');
const { importScheme, markStaleSchemes } = require('./importers/schemeImporter');
const { SourceLogger } = require('./utils/sourceLogger');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const sources = [
    require('./sources/schemes/dataGovSchemesSource'),
    require('./sources/schemes/csvSchemesSource'),
];

async function syncSchemes() {
    console.log('\n🔄 Starting Schemes Sync...\n');

    for (const source of sources) {
        const logger = new SourceLogger(`${source.sourceName} (Schemes)`);

        try {
            const { records, meta, error } = await source.fetchRecords();
            if (error) logger.recordSourceInaccessible(error);
            logger.recordFetch(records.length);

            if (records.length === 0) {
                logger.printSummary();
                continue;
            }

            const activeRecordIds = [];

            for (const raw of records) {
                const sourceMeta = raw._sourceMeta || meta;
                const normalized = normalizeScheme(raw, sourceMeta);
                const validation = validateScheme(normalized);

                if (!validation.valid) {
                    logger.recordSkip(
                        validation.errors.join('; '),
                        normalized.source_record_id || normalized.title
                    );
                    continue;
                }

                logger.recordValid();
                const result = await importScheme(normalized, logger);

                if (result !== 'failed' && normalized.source_record_id) {
                    activeRecordIds.push(normalized.source_record_id);
                }
            }

            if (meta.sourceName && activeRecordIds.length > 0) {
                await markStaleSchemes(meta.sourceName, activeRecordIds);
            }

            logger.printSummary();
        } catch (err) {
            console.error(`❌ [${source.sourceName}] Sync error: ${err.message}`);
            logger.printSummary();
        }
    }

    console.log('✅ Schemes sync complete\n');
}

if (require.main === module) {
    syncSchemes()
        .then(() => process.exit(0))
        .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { syncSchemes };
