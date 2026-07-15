/**
 * Source Logger — tracks and prints sync results.
 */

class SourceLogger {
    constructor(sourceName) {
        this.sourceName = sourceName;
        this.stats = {
            fetched: 0,
            valid: 0,
            inserted: 0,
            updated: 0,
            skipped: 0,
            failed: 0,
            errors: [],
        };
        this.startTime = Date.now();
    }

    recordFetch(count) {
        this.stats.fetched = count;
    }

    recordValid() {
        this.stats.valid++;
    }

    recordInsert() {
        this.stats.inserted++;
    }

    recordUpdate() {
        this.stats.updated++;
    }

    recordSkip(reason, recordId) {
        this.stats.skipped++;
        if (reason) {
            this.stats.errors.push({
                type: 'skip',
                recordId: recordId || 'unknown',
                reason,
            });
        }
    }

    recordFailure(reason, recordId) {
        this.stats.failed++;
        this.stats.errors.push({
            type: 'failure',
            recordId: recordId || 'unknown',
            reason,
        });
    }

    recordSourceInaccessible(reason) {
        console.warn(`⚠️  [${this.sourceName}] Source inaccessible: ${reason}`);
        this.stats.errors.push({
            type: 'source_inaccessible',
            reason,
        });
    }

    printSummary() {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
        console.log(`\n${'═'.repeat(50)}`);
        console.log(`📊 ${this.sourceName} Sync Summary`);
        console.log(`${'─'.repeat(50)}`);
        console.log(`   Fetched:  ${this.stats.fetched}`);
        console.log(`   Valid:    ${this.stats.valid}`);
        console.log(`   Inserted: ${this.stats.inserted}`);
        console.log(`   Updated:  ${this.stats.updated}`);
        console.log(`   Skipped:  ${this.stats.skipped}`);
        console.log(`   Failed:   ${this.stats.failed}`);
        console.log(`   Time:     ${elapsed}s`);

        if (this.stats.errors.length > 0) {
            const skips = this.stats.errors.filter(e => e.type === 'skip');
            const failures = this.stats.errors.filter(e => e.type === 'failure');
            if (skips.length > 0) {
                console.log(`\n   Skip reasons (first 5):`);
                skips.slice(0, 5).forEach(e => {
                    console.log(`     - [${e.recordId}] ${e.reason}`);
                });
            }
            if (failures.length > 0) {
                console.log(`\n   Failure reasons (first 5):`);
                failures.slice(0, 5).forEach(e => {
                    console.log(`     - [${e.recordId}] ${e.reason}`);
                });
            }
        }
        console.log(`${'═'.repeat(50)}\n`);
    }

    getStats() {
        return { ...this.stats };
    }
}

module.exports = { SourceLogger };
