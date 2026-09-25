/**
 * Recommendation Service
 * Bridges Node.js Express backend with the Python ML Recommendation Engine (Flask on port 5001).
 * 
 * Features:
 * - Real-time TF-IDF + Cosine Similarity + Eligibility Hybrid scoring from Python ML service.
 * - Database UUID resolution so frontend links (/schemes/:id, /jobs/:id, /courses/:id) work seamlessly.
 * - Automatic resilient fallback if the Python service is not running.
 */

const pool = require('../db/pool');

const PYTHON_REC_URL = process.env.PYTHON_REC_URL || 'http://127.0.0.1:5001';

async function fetchPythonRecs(endpoint, payload, params = {}) {
  const url = new URL(`${PYTHON_REC_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Python recommender responded with status ${res.status}`);
    }
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    clearTimeout(timeoutId);
    return null; // Signals fallback required
  }
}

/**
 * Resolves database UUIDs for schemes returned by the ML service
 */
async function attachDbIdsForSchemes(schemes) {
  if (!schemes || schemes.length === 0) return [];
  const titles = schemes.map(s => s.title.trim().toLowerCase());
  
  try {
    const res = await pool.query(
      `SELECT id, title, slug FROM schemes WHERE lower(trim(title)) = ANY($1) OR slug = ANY($1)`,
      [titles]
    );
    const titleMap = new Map();
    res.rows.forEach(r => {
      titleMap.set(r.title.trim().toLowerCase(), r.id);
      if (r.slug) titleMap.set(r.slug, r.id);
    });

    return schemes.map(s => ({
      ...s,
      id: titleMap.get(s.title.trim().toLowerCase()) || titleMap.get(s.id) || s.id,
    }));
  } catch (err) {
    return schemes;
  }
}

/**
 * Resolves database UUIDs for jobs
 */
async function attachDbIdsForJobs(jobs) {
  if (!jobs || jobs.length === 0) return [];
  const titles = jobs.map(j => j.title.trim().toLowerCase());

  try {
    const res = await pool.query(
      `SELECT id, title FROM jobs WHERE lower(trim(title)) = ANY($1)`,
      [titles]
    );
    const titleMap = new Map();
    res.rows.forEach(r => titleMap.set(r.title.trim().toLowerCase(), r.id));

    return jobs.map(j => ({
      ...j,
      id: titleMap.get(j.title.trim().toLowerCase()) || j.id,
    }));
  } catch (err) {
    return jobs;
  }
}

/**
 * Resolves database UUIDs for courses
 */
async function attachDbIdsForCourses(courses) {
  if (!courses || courses.length === 0) return [];
  const titles = courses.map(c => c.title.trim().toLowerCase());

  try {
    const res = await pool.query(
      `SELECT id, title FROM courses WHERE lower(trim(title)) = ANY($1)`,
      [titles]
    );
    const titleMap = new Map();
    res.rows.forEach(r => titleMap.set(r.title.trim().toLowerCase(), r.id));

    return courses.map(c => ({
      ...c,
      id: titleMap.get(c.title.trim().toLowerCase()) || c.id,
    }));
  } catch (err) {
    return courses;
  }
}

module.exports = {
  fetchPythonRecs,
  attachDbIdsForSchemes,
  attachDbIdsForJobs,
  attachDbIdsForCourses,
};
