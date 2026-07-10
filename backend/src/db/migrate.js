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
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(255) NOT NULL, phone VARCHAR(20) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE, password_hash VARCHAR(255) NOT NULL, role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user','org','admin')), language_pref VARCHAR(10) DEFAULT 'en', state VARCHAR(100), district VARCHAR(100), village VARCHAR(100), profile_complete BOOLEAN DEFAULT FALSE, is_verified BOOLEAN DEFAULT FALSE, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS user_profiles (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, age INTEGER, education VARCHAR(100), skills TEXT[], interests TEXT[], languages_known TEXT[], work_experience VARCHAR(50), bio TEXT, avatar_url VARCHAR(500), resume_url VARCHAR(500), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS organizations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, org_name VARCHAR(255) NOT NULL, org_type VARCHAR(100), registration_number VARCHAR(100), description TEXT, website VARCHAR(255), logo_url VARCHAR(500), address TEXT, state VARCHAR(100), district VARCHAR(100), contact_person VARCHAR(255), is_verified BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS otps (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), phone VARCHAR(20), email VARCHAR(255), otp_hash VARCHAR(255) NOT NULL, purpose VARCHAR(50) NOT NULL, expires_at TIMESTAMP NOT NULL, is_used BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS jobs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, job_type VARCHAR(50), work_mode VARCHAR(50), location_state VARCHAR(100), location_district VARCHAR(100), salary_min INTEGER, salary_max INTEGER, skills_required TEXT[], education_required VARCHAR(100), language_required TEXT[], application_deadline DATE, seats INTEGER, category VARCHAR(100), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS courses (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID REFERENCES organizations(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, duration VARCHAR(100), mode VARCHAR(50), language TEXT[], skills_taught TEXT[], certification BOOLEAN DEFAULT FALSE, is_free BOOLEAN DEFAULT TRUE, fee INTEGER DEFAULT 0, location_state VARCHAR(100), location_district VARCHAR(100), start_date DATE, end_date DATE, seats INTEGER, category VARCHAR(100), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS schemes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title VARCHAR(255) NOT NULL, description TEXT NOT NULL, scheme_type VARCHAR(100), ministry VARCHAR(255), eligibility_criteria TEXT, benefits TEXT, how_to_apply TEXT, documents_required TEXT[], state VARCHAR(100) DEFAULT 'All', category VARCHAR(100), application_link VARCHAR(500), is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS applications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, entity_id UUID NOT NULL, entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('job','course','scheme')), status VARCHAR(50) DEFAULT 'applied', cover_letter TEXT, applied_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS chat_sessions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE SET NULL, session_token VARCHAR(255) UNIQUE NOT NULL, language VARCHAR(10) DEFAULT 'en', created_at TIMESTAMP DEFAULT NOW(), last_active TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS chat_messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE, role VARCHAR(10) CHECK (role IN ('user','assistant')), content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS bookmarks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, entity_id UUID NOT NULL, entity_type VARCHAR(20) NOT NULL, created_at TIMESTAMP DEFAULT NOW(), UNIQUE(user_id,entity_id,entity_type));
      
      CREATE TABLE IF NOT EXISTS recommendation_feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        entity_id UUID NOT NULL,
        entity_type VARCHAR(20) NOT NULL,
        action VARCHAR(20) DEFAULT 'view',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, entity_id, entity_type)
      );
      CREATE TABLE IF NOT EXISTS notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(255) NOT NULL, message TEXT NOT NULL, type VARCHAR(50), is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW());
    `;
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};
run();
