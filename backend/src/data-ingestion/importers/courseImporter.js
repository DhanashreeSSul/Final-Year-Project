/**
 * Course Importer — inserts/updates normalized course records into PostgreSQL.
 */
const pool = require('../../db/pool');
const { courseFingerprint } = require('../utils/deduplication');

async function importCourse(course, logger) {
    try {
        const dedupId = course.source_record_id || courseFingerprint(course);

        const existing = await pool.query(
            `SELECT id FROM courses 
       WHERE (source_record_id = $1 AND source_name = $2)
          OR (source_record_id IS NULL AND source_name = $2 AND title = $3)
       LIMIT 1`,
            [dedupId, course.source_name, course.title]
        );

        if (existing.rows.length > 0) {
            await pool.query(`
        UPDATE courses SET
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          duration = COALESCE($4, duration),
          mode = COALESCE($5, mode),
          language = COALESCE($6, language),
          skills_taught = COALESCE($7, skills_taught),
          certification = COALESCE($8, certification),
          is_free = COALESCE($9, is_free),
          fee = COALESCE($10, fee),
          location_state = COALESCE($11, location_state),
          category = COALESCE($12, category),
          external_course_url = COALESCE($13, external_course_url),
          registration_url = COALESCE($14, registration_url),
          provider_type = COALESCE($15, provider_type),
          source_url = COALESCE($16, source_url),
          last_verified_at = NOW(),
          data_status = 'active',
          is_official_source = COALESCE($17, is_official_source),
          updated_at = NOW()
        WHERE id = $1
      `, [
                existing.rows[0].id,
                course.title, course.description, course.duration, course.mode,
                course.language, course.skills_taught, course.certification,
                course.is_free, course.fee, course.location_state, course.category,
                course.external_course_url, course.registration_url,
                course.provider_type, course.source_url, course.is_official_source,
            ]);
            logger.recordUpdate();
            return 'updated';
        } else {
            await pool.query(`
        INSERT INTO courses (
          title, description, duration, mode, language,
          skills_taught, certification, is_free, fee,
          location_state, location_district, category,
          external_course_url, registration_url, provider_type,
          source_name, source_url, source_record_id,
          source_type, source_dataset_name,
          last_verified_at, imported_at, data_status,
          is_official_source, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, NOW(), NOW(), 'active', $21, TRUE
        )
      `, [
                course.title, course.description, course.duration, course.mode,
                course.language, course.skills_taught, course.certification,
                course.is_free, course.fee, course.location_state,
                course.location_district, course.category,
                course.external_course_url, course.registration_url,
                course.provider_type, course.source_name, course.source_url,
                dedupId, course.source_type, course.source_dataset_name,
                course.is_official_source,
            ]);
            logger.recordInsert();
            return 'inserted';
        }
    } catch (err) {
        logger.recordFailure(err.message, course.source_record_id || course.title);
        return 'failed';
    }
}

async function markStaleCourses(sourceName, activeRecordIds) {
    if (!sourceName || activeRecordIds.length === 0) return;
    try {
        await pool.query(`
      UPDATE courses SET data_status = 'stale', updated_at = NOW()
      WHERE source_name = $1 AND data_status = 'active'
        AND source_record_id IS NOT NULL
        AND source_record_id != ALL($2::text[])
    `, [sourceName, activeRecordIds]);
    } catch (err) {
        console.error(`Failed to mark stale courses: ${err.message}`);
    }
}

module.exports = { importCourse, markStaleCourses };
