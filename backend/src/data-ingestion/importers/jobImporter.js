/**
 * Job Importer — inserts/updates normalized job records into PostgreSQL.
 * Uses UPSERT with source_record_id + source_name deduplication.
 */
const pool = require('../../db/pool');
const { jobFingerprint } = require('../utils/deduplication');

/**
 * Import a single normalized job record.
 * @param {object} job - Normalized job record
 * @param {object} logger - SourceLogger instance
 * @returns {string} 'inserted' | 'updated' | 'skipped'
 */
async function importJob(job, logger) {
    try {
        // Determine dedup key
        const dedupId = job.source_record_id || jobFingerprint(job);

        // Check for existing record by source_name + source_record_id/fingerprint
        const existing = await pool.query(
            `SELECT id, source_record_id FROM jobs 
       WHERE (source_record_id = $1 AND source_name = $2)
          OR (source_record_id IS NULL AND source_name = $2 AND title = $3 AND location_state IS NOT DISTINCT FROM $4)
       LIMIT 1`,
            [dedupId, job.source_name, job.title, job.location_state]
        );

        if (existing.rows.length > 0) {
            // Update existing record
            await pool.query(`
        UPDATE jobs SET
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          job_type = COALESCE($4, job_type),
          work_mode = COALESCE($5, work_mode),
          location_state = COALESCE($6, location_state),
          location_district = COALESCE($7, location_district),
          salary_min = COALESCE($8, salary_min),
          salary_max = COALESCE($9, salary_max),
          skills_required = COALESCE($10, skills_required),
          education_required = COALESCE($11, education_required),
          category = COALESCE($12, category),
          posted_date = COALESCE($13, posted_date),
          application_deadline = COALESCE($14, application_deadline),
          external_application_url = COALESCE($15, external_application_url),
          source_url = COALESCE($16, source_url),
          source_type = COALESCE($17, source_type),
          source_dataset_name = COALESCE($18, source_dataset_name),
          source_api_url = COALESCE($19, source_api_url),
          last_verified_at = NOW(),
          data_status = 'active',
          is_official_source = COALESCE($20, is_official_source),
          updated_at = NOW()
        WHERE id = $1
      `, [
                existing.rows[0].id,
                job.title, job.description, job.job_type, job.work_mode,
                job.location_state, job.location_district,
                job.salary_min, job.salary_max,
                job.skills_required, job.education_required, job.category,
                job.posted_date, job.application_deadline,
                job.external_application_url,
                job.source_url, job.source_type, job.source_dataset_name,
                job.source_api_url, job.is_official_source,
            ]);
            logger.recordUpdate();
            return 'updated';
        } else {
            // Insert new record
            await pool.query(`
        INSERT INTO jobs (
          title, description, job_type, work_mode,
          location_state, location_district,
          salary_min, salary_max, skills_required,
          education_required, category,
          posted_date, application_deadline,
          external_application_url,
          source_name, source_url, source_record_id,
          source_type, source_dataset_name, source_dataset_id,
          source_api_url, last_verified_at, imported_at,
          data_status, is_official_source, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, NOW(), NOW(), 'active', $22, TRUE
        )
      `, [
                job.title, job.description, job.job_type, job.work_mode,
                job.location_state, job.location_district,
                job.salary_min, job.salary_max, job.skills_required,
                job.education_required, job.category,
                job.posted_date, job.application_deadline,
                job.external_application_url,
                job.source_name, job.source_url, dedupId,
                job.source_type, job.source_dataset_name, job.source_dataset_id,
                job.source_api_url, job.is_official_source,
            ]);
            logger.recordInsert();
            return 'inserted';
        }
    } catch (err) {
        logger.recordFailure(err.message, job.source_record_id || job.title);
        return 'failed';
    }
}

/**
 * Mark stale jobs — jobs from a source not in the current batch.
 */
async function markStaleJobs(sourceName, activeRecordIds) {
    if (!sourceName || activeRecordIds.length === 0) return;

    try {
        // Mark jobs from this source that are NOT in the current batch as stale
        await pool.query(`
      UPDATE jobs SET data_status = 'stale', updated_at = NOW()
      WHERE source_name = $1
        AND data_status = 'active'
        AND source_record_id IS NOT NULL
        AND source_record_id != ALL($2::text[])
    `, [sourceName, activeRecordIds]);
    } catch (err) {
        console.error(`Failed to mark stale jobs: ${err.message}`);
    }
}

/**
 * Mark expired jobs — past application deadline.
 */
async function markExpiredJobs() {
    try {
        const result = await pool.query(`
      UPDATE jobs SET data_status = 'expired', updated_at = NOW()
      WHERE application_deadline < CURRENT_DATE
        AND data_status = 'active'
    `);
        if (result.rowCount > 0) {
            console.log(`📅 Marked ${result.rowCount} expired jobs`);
        }
    } catch (err) {
        console.error(`Failed to mark expired jobs: ${err.message}`);
    }
}

module.exports = { importJob, markStaleJobs, markExpiredJobs };
