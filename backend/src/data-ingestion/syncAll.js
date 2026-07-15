/**
 * Sync All — orchestrates all data ingestion in sequence.
 */
const { syncJobs } = require('./syncJobs');
const { syncCourses } = require('./syncCourses');
const { syncSchemes } = require('./syncSchemes');

async function syncAll() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   Shakti Platform — Data Sync            ║');
    console.log('║   Real Data Ingestion from Official      ║');
    console.log('║   Government Sources                     ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`\nStarted at: ${new Date().toISOString()}\n`);

    const startTime = Date.now();

    try {
        await syncJobs();
        await syncCourses();
        await syncSchemes();
    } catch (err) {
        console.error('❌ Sync failed:', err.message);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ All sync complete in ${elapsed}s`);
    console.log(`Finished at: ${new Date().toISOString()}\n`);
}

if (require.main === module) {
    syncAll()
        .then(() => process.exit(0))
        .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { syncAll };
