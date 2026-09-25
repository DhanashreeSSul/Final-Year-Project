"""
Database Ingestion Script:
- Synchronizes the 4,693 government schemes, curated jobs, and courses into PostgreSQL.
- Ensures schema columns for eligibility and provenance exist.
- Allows browsing, searching, and detail views of all schemes across Shakti Platform.
"""

import os
import sys
import json
import psycopg2
from psycopg2.extras import execute_batch
from dotenv import load_dotenv

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
ENV_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", ".env"))
load_dotenv(ENV_PATH)

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "5432")
DB_NAME = os.environ.get("DB_NAME", "shakti_platform")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "password")

def connect_db():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def setup_schema(conn):
    print("🔄 Ensuring table schema and eligibility columns exist...")
    with conn.cursor() as cur:
        # Schemes table enhancements
        cur.execute("""
            ALTER TABLE schemes ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
            ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_age_min REAL;
            ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_age_max REAL;
            ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_gender VARCHAR(50);
            ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_income_max REAL;
            ALTER TABLE schemes ADD COLUMN IF NOT EXISTS eligibility_state TEXT;
            ALTER TABLE schemes ADD COLUMN IF NOT EXISTS beneficiary_type TEXT;

            CREATE INDEX IF NOT EXISTS idx_schemes_slug ON schemes(slug);
            CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
            CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
        """)

        # Jobs table enhancements
        cur.execute("""
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_age_min INTEGER;
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_age_max INTEGER;
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_gender VARCHAR(50);
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_income_max INTEGER;
            ALTER TABLE jobs ADD COLUMN IF NOT EXISTS eligibility_state TEXT;
        """)

        # Courses table enhancements
        cur.execute("""
            ALTER TABLE courses ADD COLUMN IF NOT EXISTS eligibility_age_min INTEGER;
            ALTER TABLE courses ADD COLUMN IF NOT EXISTS eligibility_age_max INTEGER;
            ALTER TABLE courses ADD COLUMN IF NOT EXISTS eligibility_gender VARCHAR(50);
        """)

        # User profile enhancements
        cur.execute("""
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS income INTEGER DEFAULT 150000;
            ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'female';
        """)
        conn.commit()
    print("✅ Schema columns verified.")

def ingest_schemes(conn):
    schemes_json = os.path.join(DATA_DIR, "schemes.json")
    if not os.path.exists(schemes_json):
        print(f"❌ {schemes_json} not found.")
        return

    with open(schemes_json, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    print(f"🔄 Ingesting {len(schemes)} schemes into PostgreSQL...")
    
    with conn.cursor() as cur:
        # Fetch existing titles/slugs to avoid duplicates
        cur.execute("SELECT slug, title FROM schemes WHERE slug IS NOT NULL OR title IS NOT NULL")
        existing_rows = cur.fetchall()
        existing_slugs = {r[0] for r in existing_rows if r[0]}
        existing_titles = {r[1].strip().lower() for r in existing_rows if r[1]}

        insert_sql = """
            INSERT INTO schemes (
                title, description, scheme_type, ministry, eligibility_criteria,
                benefits, how_to_apply, documents_required, state, category,
                application_link, official_scheme_url, official_application_url,
                slug, eligibility_age_min, eligibility_age_max, eligibility_gender,
                eligibility_income_max, eligibility_state, beneficiary_type,
                source_name, source_type, is_official_source, is_active
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, TRUE, TRUE
            )
        """

        batch = []
        for s in schemes:
            slug = s.get("slug")
            name = (s.get("name") or s.get("title") or "").strip()
            if not name:
                continue

            if slug and slug in existing_slugs:
                continue
            if name.lower() in existing_titles:
                continue

            docs = s.get("documents_required")
            if isinstance(docs, str):
                docs_list = [d.strip() for d in docs.split(",") if d.strip()]
            elif isinstance(docs, list):
                docs_list = docs
            else:
                docs_list = []

            batch.append((
                name[:254],
                s.get("description") or "",
                s.get("category") or "Welfare",
                (s.get("ministry") or s.get("department") or "Government of India")[:254],
                s.get("eligibility_text") or "",
                s.get("benefits") or "",
                s.get("application_process") or "",
                docs_list,
                s.get("state") or "All",
                s.get("category") or "General",
                s.get("apply_url") or s.get("official_url") or "",
                s.get("official_url") or "",
                s.get("apply_url") or "",
                slug or "",
                s.get("eligibility_age_min"),
                s.get("eligibility_age_max"),
                s.get("eligibility_gender"),
                s.get("eligibility_income_max"),
                str(s.get("eligibility_state") or ""),
                str(s.get("beneficiary_type") or ""),
                "smartduketech/indian-government-schemes-2025",
                "huggingface_dataset"
            ))

            if slug:
                existing_slugs.add(slug)
            existing_titles.add(name.lower())

        if batch:
            print(f"📦 Inserting {len(batch)} new schemes in batches of 500...")
            execute_batch(cur, insert_sql, batch, page_size=500)
            conn.commit()
            print(f"✅ Successfully inserted {len(batch)} schemes!")
        else:
            print("ℹ️ All schemes are already up to date in the database.")

def ingest_jobs(conn):
    jobs_json = os.path.join(DATA_DIR, "jobs.json")
    if not os.path.exists(jobs_json):
        return

    with open(jobs_json, "r", encoding="utf-8") as f:
        jobs = json.load(f)

    print(f"🔄 Ingesting {len(jobs)} jobs into PostgreSQL...")
    with conn.cursor() as cur:
        # Get an org_id
        cur.execute("SELECT id FROM organizations LIMIT 1")
        org_row = cur.fetchone()
        org_id = org_row[0] if org_row else None

        cur.execute("SELECT title FROM jobs")
        existing_jobs = {r[0].strip().lower() for r in cur.fetchall() if r[0]}

        insert_sql = """
            INSERT INTO jobs (
                org_id, title, description, job_type, work_mode,
                location_state, location_district, salary_min, salary_max,
                skills_required, education_required, category, seats,
                eligibility_age_min, eligibility_age_max, eligibility_gender,
                eligibility_income_max, eligibility_state, is_active
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, TRUE
            )
        """
        batch = []
        for j in jobs:
            title = j.get("title", "").strip()
            if title.lower() in existing_jobs:
                continue

            batch.append((
                org_id,
                title,
                j.get("description", ""),
                "full-time",
                j.get("work_mode", "onsite"),
                j.get("location_state", "All"),
                j.get("location_district", ""),
                j.get("salary_min", 0),
                j.get("salary_max", 0),
                j.get("skills_required", []),
                j.get("education_required", "Secondary"),
                j.get("category", "General"),
                j.get("seats", 5),
                j.get("eligibility_age_min"),
                j.get("eligibility_age_max"),
                j.get("eligibility_gender"),
                j.get("eligibility_income_max"),
                str(j.get("eligibility_state", "['All']"))
            ))
            existing_jobs.add(title.lower())

        if batch:
            execute_batch(cur, insert_sql, batch)
            conn.commit()
            print(f"✅ Inserted {len(batch)} jobs!")
        else:
            print("ℹ️ Jobs are already up to date.")

def ingest_courses(conn):
    courses_json = os.path.join(DATA_DIR, "courses.json")
    if not os.path.exists(courses_json):
        return

    with open(courses_json, "r", encoding="utf-8") as f:
        courses = json.load(f)

    print(f"🔄 Ingesting {len(courses)} courses into PostgreSQL...")
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM organizations LIMIT 1")
        org_row = cur.fetchone()
        org_id = org_row[0] if org_row else None

        cur.execute("SELECT title FROM courses")
        existing_courses = {r[0].strip().lower() for r in cur.fetchall() if r[0]}

        insert_sql = """
            INSERT INTO courses (
                org_id, title, description, duration, mode, language,
                skills_taught, certification, is_free, fee,
                location_state, location_district, category, seats,
                eligibility_age_min, eligibility_age_max, eligibility_gender,
                is_active
            ) VALUES (
                %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                TRUE
            )
        """
        batch = []
        for c in courses:
            title = c.get("title", "").strip()
            if title.lower() in existing_courses:
                continue

            batch.append((
                org_id,
                title,
                c.get("description", ""),
                c.get("duration", "4 weeks"),
                c.get("mode", "online"),
                c.get("language", ["Hindi", "English"]),
                c.get("skills_taught", []),
                c.get("certification", True),
                c.get("is_free", True),
                c.get("fee", 0),
                c.get("location_state", "All"),
                c.get("location_district", ""),
                c.get("category", "General"),
                c.get("seats", 50),
                c.get("eligibility_age_min"),
                c.get("eligibility_age_max"),
                c.get("eligibility_gender")
            ))
            existing_courses.add(title.lower())

        if batch:
            execute_batch(cur, insert_sql, batch)
            conn.commit()
            print(f"✅ Inserted {len(batch)} courses!")
        else:
            print("ℹ️ Courses are already up to date.")

if __name__ == "__main__":
    try:
        conn = connect_db()
        setup_schema(conn)
        ingest_schemes(conn)
        ingest_jobs(conn)
        ingest_courses(conn)
        conn.close()
        print("\n🎉 Database synchronization completed successfully!")
    except Exception as e:
        print(f"❌ Ingestion failed: {e}")
        sys.exit(1)
