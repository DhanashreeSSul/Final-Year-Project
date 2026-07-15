/**
 * Sync Jobs — orchestrates job data ingestion from all configured sources.
 */
const { normalizeJob } = require('./normalizers/jobNormalizer');
const { validateJob } = require('./utils/validation');
const { importJob, markStaleJobs, markExpiredJobs } = require('./importers/jobImporter');
const { SourceLogger } = require('./utils/sourceLogger');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// Register all job source adapters
const sources = [
    require('./sources/jobs/dataGovJobsSource'),
    require('./sources/jobs/csvJobsSource'),
];

async function syncJobs() {
    console.log('\n🔄 Starting Jobs Sync...\n');

    for (const source of sources) {
        const logger = new SourceLogger(`${source.sourceName} (Jobs)`);

        try {
            const { records, meta, error } = await source.fetchRecords();

            if (error) {
                logger.recordSourceInaccessible(error);
            }

            logger.recordFetch(records.length);

            if (records.length === 0) {
                logger.printSummary();
                continue;
            }

            const activeRecordIds = [];

            for (const raw of records) {
                // Use per-record meta if available (CSV adapter), else use source meta
                const sourceMeta = raw._sourceMeta || meta;
                const normalized = normalizeJob(raw, sourceMeta);
                const validation = validateJob(normalized);

                if (!validation.valid) {
                    logger.recordSkip(
                        validation.errors.join('; '),
                        normalized.source_record_id || normalized.title
                    );
                    continue;
                }

                logger.recordValid();
                const result = await importJob(normalized, logger);

                if (result !== 'failed' && normalized.source_record_id) {
                    activeRecordIds.push(normalized.source_record_id);
                }
            }

            // Mark stale jobs from this source
            if (meta.sourceName && activeRecordIds.length > 0) {
                await markStaleJobs(meta.sourceName, activeRecordIds);
            }

            logger.printSummary();
        } catch (err) {
            console.error(`❌ [${source.sourceName}] Sync error: ${err.message}`);
            logger.printSummary();
        }
    }

    // Mark globally expired jobs
    await markExpiredJobs();

    console.log('✅ Jobs sync complete\n');
}

// Allow direct execution
if (require.main === module) {
    syncJobs()
        .then(() => process.exit(0))
        .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { syncJobs };
