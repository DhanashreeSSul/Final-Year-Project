const pool = require('../db/pool');

exports.getJobs = async (req, res) => {
  try {
    const { state, district, category, work_mode, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let conditions = ['j.is_active = TRUE'];
    let params = [];
    let idx = 1;
    if (state) { conditions.push(`j.location_state ILIKE $${idx++}`); params.push(`%${state}%`); }
    if (district) { conditions.push(`j.location_district ILIKE $${idx++}`); params.push(`%${district}%`); }
    if (category) { conditions.push(`j.category = $${idx++}`); params.push(category); }
    if (work_mode) { conditions.push(`j.work_mode = $${idx++}`); params.push(work_mode); }
    if (search) { conditions.push(`(j.title ILIKE $${idx} OR j.description ILIKE $${idx++})`); params.push(`%${search}%`); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const countResult = await pool.query(`SELECT COUNT(*) FROM jobs j ${where}`, params);
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT j.*, o.org_name, o.logo_url FROM jobs j LEFT JOIN organizations o ON o.id = j.org_id ${where} ORDER BY j.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      params
    );
    res.json({ success: true, data: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT j.*, o.org_name, o.logo_url, o.description as org_desc FROM jobs j LEFT JOIN organizations o ON o.id = j.org_id WHERE j.id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const orgResult = await pool.query('SELECT id FROM organizations WHERE user_id = $1', [req.user.id]);
    if (!orgResult.rows[0]) return res.status(403).json({ success: false, message: 'Organization profile required' });
    const { title, description, job_type, work_mode, location_state, location_district, salary_min, salary_max, skills_required, education_required, language_required, application_deadline, seats, category } = req.body;
    const result = await pool.query(
      'INSERT INTO jobs (org_id, title, description, job_type, work_mode, location_state, location_district, salary_min, salary_max, skills_required, education_required, language_required, application_deadline, seats, category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *',
      [orgResult.rows[0].id, title, description, job_type, work_mode, location_state, location_district, salary_min, salary_max, skills_required, education_required, language_required, application_deadline, seats, category]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const orgResult = await pool.query('SELECT id FROM organizations WHERE user_id = $1', [req.user.id]);
    if (!orgResult.rows[0]) return res.status(403).json({ success: false, message: 'Not authorized' });
    const fields = req.body;
    const updates = Object.keys(fields).map((k, i) => `${k} = $${i + 2}`);
    const values = Object.values(fields);
    const result = await pool.query(
      `UPDATE jobs SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $1 AND org_id = $${values.length + 2} RETURNING *`,
      [req.params.id, ...values, orgResult.rows[0].id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const orgResult = await pool.query('SELECT id FROM organizations WHERE user_id = $1', [req.user.id]);
    await pool.query('UPDATE jobs SET is_active = FALSE WHERE id = $1 AND org_id = $2', [req.params.id, orgResult.rows[0].id]);
    res.json({ success: true, message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
