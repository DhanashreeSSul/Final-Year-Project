/**
 * Sync Courses — orchestrates course data ingestion from all configured sources.
 */
const { normalizeCourse } = require('./normalizers/courseNormalizer');
const { validateCourse } = require('./utils/validation');
const { importCourse, markStaleCourses } = require('./importers/courseImporter');
const { SourceLogger } = require('./utils/sourceLogger');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const sources = [
    require('./sources/courses/dataGovCoursesSource'),
    require('./sources/courses/csvCoursesSource'),
];

async function syncCourses() {
    console.log('\n🔄 Starting Courses Sync...\n');

    for (const source of sources) {
        const logger = new SourceLogger(`${source.sourceName} (Courses)`);

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
                const normalized = normalizeCourse(raw, sourceMeta);
                const validation = validateCourse(normalized);

                if (!validation.valid) {
                    logger.recordSkip(
                        validation.errors.join('; '),
                        normalized.source_record_id || normalized.title
                    );
                    continue;
                }

                logger.recordValid();
                const result = await importCourse(normalized, logger);

                if (result !== 'failed' && normalized.source_record_id) {
                    activeRecordIds.push(normalized.source_record_id);
                }
            }

            if (meta.sourceName && activeRecordIds.length > 0) {
                await markStaleCourses(meta.sourceName, activeRecordIds);
            }

            logger.printSummary();
        } catch (err) {
            console.error(`❌ [${source.sourceName}] Sync error: ${err.message}`);
            logger.printSummary();
        }
    }

    console.log('✅ Courses sync complete\n');
}

if (require.main === module) {
    syncCourses()
        .then(() => process.exit(0))
        .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { syncCourses };
