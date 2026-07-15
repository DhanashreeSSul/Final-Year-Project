/**
 * Scheme Importer — inserts/updates normalized scheme records into PostgreSQL.
 */
const pool = require('../../db/pool');
const { schemeFingerprint } = require('../utils/deduplication');

async function importScheme(scheme, logger) {
    try {
        const dedupId = scheme.source_record_id || schemeFingerprint(scheme);

        const existing = await pool.query(
            `SELECT id FROM schemes 
       WHERE (source_record_id = $1 AND source_name = $2)
          OR (source_record_id IS NULL AND source_name = $2 AND title = $3)
       LIMIT 1`,
            [dedupId, scheme.source_name, scheme.title]
        );

        if (existing.rows.length > 0) {
            await pool.query(`
        UPDATE schemes SET
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          scheme_type = COALESCE($4, scheme_type),
          ministry = COALESCE($5, ministry),
          eligibility_criteria = COALESCE($6, eligibility_criteria),
          benefits = COALESCE($7, benefits),
          how_to_apply = COALESCE($8, how_to_apply),
          documents_required = COALESCE($9, documents_required),
          state = COALESCE($10, state),
          category = COALESCE($11, category),
          application_link = COALESCE($12, application_link),
          official_application_url = COALESCE($13, official_application_url),
          official_scheme_url = COALESCE($14, official_scheme_url),
          source_url = COALESCE($15, source_url),
          last_verified_at = NOW(),
          data_status = 'active',
          is_official_source = COALESCE($16, is_official_source),
          updated_at = NOW()
        WHERE id = $1
      `, [
                existing.rows[0].id,
                scheme.title, scheme.description, scheme.scheme_type,
                scheme.ministry, scheme.eligibility_criteria, scheme.benefits,
                scheme.how_to_apply, scheme.documents_required, scheme.state,
                scheme.category, scheme.application_link,
                scheme.official_application_url, scheme.official_scheme_url,
                scheme.source_url, scheme.is_official_source,
            ]);
            logger.recordUpdate();
            return 'updated';
        } else {
            await pool.query(`
        INSERT INTO schemes (
          title, description, scheme_type, ministry,
          eligibility_criteria, benefits, how_to_apply,
          documents_required, state, category, application_link,
          official_application_url, official_scheme_url,
          source_name, source_url, source_record_id,
          source_type, source_dataset_name,
          last_verified_at, imported_at, data_status,
          is_official_source, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18,
          NOW(), NOW(), 'active', $19, TRUE
        )
      `, [
                scheme.title, scheme.description, scheme.scheme_type,
                scheme.ministry, scheme.eligibility_criteria, scheme.benefits,
                scheme.how_to_apply, scheme.documents_required, scheme.state,
                scheme.category, scheme.application_link,
                scheme.official_application_url, scheme.official_scheme_url,
                scheme.source_name, scheme.source_url, dedupId,
                scheme.source_type, scheme.source_dataset_name,
                scheme.is_official_source,
            ]);
            logger.recordInsert();
            return 'inserted';
        }
    } catch (err) {
        logger.recordFailure(err.message, scheme.source_record_id || scheme.title);
        return 'failed';
    }
}

async function markStaleSchemes(sourceName, activeRecordIds) {
    if (!sourceName || activeRecordIds.length === 0) return;
    try {
        await pool.query(`
      UPDATE schemes SET data_status = 'stale', updated_at = NOW()
      WHERE source_name = $1 AND data_status = 'active'
        AND source_record_id IS NOT NULL
        AND source_record_id != ALL($2::text[])
    `, [sourceName, activeRecordIds]);
    } catch (err) {
        console.error(`Failed to mark stale schemes: ${err.message}`);
    }
}

module.exports = { importScheme, markStaleSchemes };
