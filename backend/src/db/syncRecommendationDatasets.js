/**
 * Sync Recommendation Datasets into PostgreSQL:
 * - Ensures eligibility columns exist on schemes, jobs, courses, user_profiles.
 * - Ingests the 4,693 schemes from backend/recommendation_engine/data/schemes.json
 * - Ingests curated jobs from backend/recommendation_engine/data/jobs.json
 * - Ingests curated courses from backend/recommendation_engine/data/courses.json
 */

const fs = require('fs');
const path = require('path');
const pool = require('./pool');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DATA_DIR = path.join(__dirname, '../../recommendation_engine/data');

async function ensureColumns(client) {
  console.log('🔄 Verifying and adding eligibility columns...');
  await client.query(`
    ALTER TABLE schemes ALTER COLUMN application_link TYPE TEXT;
    ALTER TABLE schemes ALTER COLUMN title TYPE TEXT;
    ALTER TABLE schemes ALTER COLUMN ministry TYPE TEXT;
    ALTER TABLE schemes ALTER COLUMN scheme_type TYPE TEXT;
    ALTER TABLE schemes ALTER COLUMN state TYPE TEXT;
    ALTER TABLE schemes ALTER COLUMN category TYPE TEXT;

    ALTER TABLE schemes ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
    ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_age_min REAL;
    ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_age_max REAL;
    ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_gender VARCHAR(50);
    ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_income_max REAL;
    ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_state TEXT;
    ALTER TABLE schemes ADD COLUMN IF NOT EXISTS beneficiary_type TEXT;

    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_age_min INTEGER;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_age_max INTEGER;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_gender VARCHAR(50);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_income_max INTEGER;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_state TEXT;

    ALTER TABLE courses ADD COLUMN IF NOT EXISTS eligibility_age_min INTEGER;
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS eligibility_age_max INTEGER;
    ALTER TABLE courses ADD COLUMN IF NOT EXISTS eligibility_gender VARCHAR(50);

    ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS income INTEGER DEFAULT 150000;
    ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'female';

    CREATE INDEX IF NOT EXISTS idx_schemes_slug ON schemes(slug);
    CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
    CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
  `);
  console.log('✅ Columns and indexes verified.');
}


async function syncSchemes(client) {
  const filePath = path.join(DATA_DIR, 'schemes.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Schemes file not found at ${filePath}`);
    return;
  }

  const schemes = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`🔄 Syncing ${schemes.length} schemes...`);

  // Fetch existing titles to avoid duplicate insertions
  const res = await client.query('SELECT lower(trim(title)) as t, slug FROM schemes WHERE title IS NOT NULL');
  const existingTitles = new Set(res.rows.map(r => r.t));
  const existingSlugs = new Set(res.rows.map(r => r.slug).filter(Boolean));

  let inserted = 0;
  for (let i = 0; i < schemes.length; i += 200) {
    const chunk = schemes.slice(i, i + 200);
    const validRows = [];

    for (const s of chunk) {
      const title = (s.name || s.title || '').trim();
      if (!title) continue;
      if (s.slug && existingSlugs.has(s.slug)) continue;
      if (existingTitles.has(title.toLowerCase())) continue;

      let docs = s.documents_required;
      if (typeof docs === 'string') {
        docs = docs.split(',').map(d => d.trim()).filter(Boolean);
      } else if (!Array.isArray(docs)) {
        docs = [];
      }

      validRows.push([
        title.substring(0, 254),
        s.description || '',
        (s.category || 'Welfare').substring(0, 99),
        (s.ministry || s.department || 'Government of India').substring(0, 254),
        s.eligibility_text || '',
        s.benefits || '',
        s.application_process || '',
        docs,
        (s.state || 'All').substring(0, 99),
        (s.category || 'General').substring(0, 99),
        s.apply_url || s.official_url || '',
        s.official_url || '',
        s.apply_url || '',
        s.slug || '',
        s.eligibility_age_min || null,
        s.eligibility_age_max || null,
        s.eligibility_gender || null,
        s.eligibility_income_max || null,
        s.eligibility_state || '',
        s.beneficiary_type || '',
        'smartduketech/indian-government-schemes-2025',
        'huggingface_dataset'
      ]);

      if (s.slug) existingSlugs.add(s.slug);
      existingTitles.add(title.toLowerCase());
    }

    if (validRows.length > 0) {
      for (const row of validRows) {
        await client.query(`
          INSERT INTO schemes (
            title, description, scheme_type, ministry, eligibility_criteria,
            benefits, how_to_apply, documents_required, state, category,
            application_link, official_scheme_url, official_application_url,
            slug, eligibility_age_min, eligibility_age_max, eligibility_gender,
            eligibility_income_max, eligibility_state, beneficiary_type,
            source_name, source_type, is_official_source, is_active
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13,
            $14, $15, $16, $17,
            $18, $19, $20,
            $21, $22, TRUE, TRUE
          )
        `, row);
        inserted++;
      }
    }
    process.stdout.write(`\r   Progress: ${Math.min(i + 200, schemes.length)} / ${schemes.length} schemes evaluated (Inserted: ${inserted})`);
  }
  console.log(`\n✅ Finished schemes sync. Added ${inserted} new schemes to database.`);
}

async function syncJobs(client) {
  const filePath = path.join(DATA_DIR, 'jobs.json');
  if (!fs.existsSync(filePath)) return;

  const jobs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`🔄 Syncing ${jobs.length} curated jobs...`);

  const orgRes = await client.query('SELECT id FROM organizations LIMIT 1');
  const orgId = orgRes.rows[0]?.id || null;

  const existingRes = await client.query('SELECT lower(trim(title)) as t FROM jobs');
  const existingTitles = new Set(existingRes.rows.map(r => r.t));

  let inserted = 0;
  for (const j of jobs) {
    const title = (j.title || '').trim();
    if (!title || existingTitles.has(title.toLowerCase())) continue;

    await client.query(`
      INSERT INTO jobs (
        org_id, title, description, job_type, work_mode,
        location_state, location_district, salary_min, salary_max,
        skills_required, education_required, category, seats,
        eligibility_age_min, eligibility_age_max, eligibility_gender,
        eligibility_income_max, eligibility_state, is_active
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15, $16,
        $17, $18, TRUE
      )
    `, [
      orgId,
      title,
      j.description || '',
      'full-time',
      j.work_mode || 'onsite',
      j.location_state || 'All',
      j.location_district || '',
      j.salary_min || 0,
      j.salary_max || 0,
      j.skills_required || [],
      j.education_required || 'Secondary',
      j.category || 'General',
      j.seats || 5,
      j.eligibility_age_min || null,
      j.eligibility_age_max || null,
      j.eligibility_gender || null,
      j.eligibility_income_max || null,
      j.eligibility_state || "['All']"
    ]);
    existingTitles.add(title.toLowerCase());
    inserted++;
  }
  console.log(`✅ Jobs sync finished. Added ${inserted} new jobs.`);
}

async function syncCourses(client) {
  const filePath = path.join(DATA_DIR, 'courses.json');
  if (!fs.existsSync(filePath)) return;

  const courses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`🔄 Syncing ${courses.length} curated courses...`);

  const orgRes = await client.query('SELECT id FROM organizations LIMIT 1');
  const orgId = orgRes.rows[0]?.id || null;

  const existingRes = await client.query('SELECT lower(trim(title)) as t FROM courses');
  const existingTitles = new Set(existingRes.rows.map(r => r.t));

  let inserted = 0;
  for (const c of courses) {
    const title = (c.title || '').trim();
    if (!title || existingTitles.has(title.toLowerCase())) continue;

    await client.query(`
      INSERT INTO courses (
        org_id, title, description, duration, mode, language,
        skills_taught, certification, is_free, fee,
        location_state, location_district, category, seats,
        eligibility_age_min, eligibility_age_max, eligibility_gender,
        is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17,
        TRUE
      )
    `, [
      orgId,
      title,
      c.description || '',
      c.duration || '4 weeks',
      c.mode || 'online',
      c.language || ['Hindi', 'English'],
      c.skills_taught || [],
      c.certification !== false,
      c.is_free !== false,
      c.fee || 0,
      c.location_state || 'All',
      c.location_district || '',
      c.category || 'General',
      c.seats || 50,
      c.eligibility_age_min || null,
      c.eligibility_age_max || null,
      c.eligibility_gender || null
    ]);
    existingTitles.add(title.toLowerCase());
    inserted++;
  }
  console.log(`✅ Courses sync finished. Added ${inserted} new courses.`);
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await ensureColumns(client);
    await syncSchemes(client);
    await syncJobs(client);
    await syncCourses(client);
    await client.query('COMMIT');
    console.log('\n🎉 Dataset synchronization to PostgreSQL complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Sync failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = { syncRecommendationDatasets: main };
