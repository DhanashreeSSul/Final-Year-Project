/**
 * Additive Migration: Source Provenance Columns
 * 
 * Adds source tracking, data status, and provenance columns to
 * jobs, courses, and schemes tables. Uses ADD COLUMN IF NOT EXISTS
 * to safely run multiple times. Does NOT drop or rename anything.
 */
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'shakti_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

const run = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // ── JOBS TABLE ──────────────────────────────────────────────
        await client.query(`
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_name VARCHAR(255);
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_url TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_record_id VARCHAR(255);
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_type VARCHAR(50);
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_dataset_name VARCHAR(255);
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_dataset_id VARCHAR(255);
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_api_url TEXT;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS data_status VARCHAR(50) DEFAULT 'active';
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_official_source BOOLEAN DEFAULT FALSE;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_date DATE;
      ALTER TABLE jobs ADD COLUMN IF NOT EXISTS external_application_url TEXT;
    `);

        // ── COURSES TABLE ───────────────────────────────────────────
        await client.query(`
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS source_name VARCHAR(255);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS source_url TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS source_record_id VARCHAR(255);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS source_type VARCHAR(50);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS source_dataset_name VARCHAR(255);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS data_status VARCHAR(50) DEFAULT 'active';
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_official_source BOOLEAN DEFAULT FALSE;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS external_course_url TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS registration_url TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS provider_type VARCHAR(100);
    `);

        // ── SCHEMES TABLE ───────────────────────────────────────────
        await client.query(`
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS source_name VARCHAR(255);
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS source_url TEXT;
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS source_record_id VARCHAR(255);
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS source_type VARCHAR(50);
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS source_dataset_name VARCHAR(255);
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP;
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS data_status VARCHAR(50) DEFAULT 'active';
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS is_official_source BOOLEAN DEFAULT FALSE;
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS official_application_url TEXT;
      ALTER TABLE schemes ADD COLUMN IF NOT EXISTS official_scheme_url TEXT;
    `);

        // ── INDEXES ─────────────────────────────────────────────────
        // Use CREATE INDEX IF NOT EXISTS for idempotency
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_data_status ON jobs(data_status);
      CREATE INDEX IF NOT EXISTS idx_jobs_source_record_id ON jobs(source_record_id);
      CREATE INDEX IF NOT EXISTS idx_jobs_source_name ON jobs(source_name);
      CREATE INDEX IF NOT EXISTS idx_jobs_location_state ON jobs(location_state);
      CREATE INDEX IF NOT EXISTS idx_jobs_location_district ON jobs(location_district);
      CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);

      CREATE INDEX IF NOT EXISTS idx_courses_data_status ON courses(data_status);
      CREATE INDEX IF NOT EXISTS idx_courses_source_record_id ON courses(source_record_id);
      CREATE INDEX IF NOT EXISTS idx_courses_source_name ON courses(source_name);
      CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
      CREATE INDEX IF NOT EXISTS idx_courses_is_free ON courses(is_free);

      CREATE INDEX IF NOT EXISTS idx_schemes_data_status ON schemes(data_status);
      CREATE INDEX IF NOT EXISTS idx_schemes_source_record_id ON schemes(source_record_id);
      CREATE INDEX IF NOT EXISTS idx_schemes_source_name ON schemes(source_name);
      CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
      CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
    `);

        await client.query('COMMIT');
        console.log('✅ Provenance migration completed successfully!');
        console.log('   Added source tracking columns to: jobs, courses, schemes');
        console.log('   Added 17 indexes for query performance');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
};

run();
