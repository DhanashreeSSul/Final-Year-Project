const pool = require('../db/pool');

exports.getCourses = async (req, res) => {
  try {
    const { state, category, mode, is_free, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let conditions = ['c.is_active = TRUE'];
    let params = [];
    let idx = 1;
    if (state) { conditions.push(`c.location_state ILIKE $${idx++}`); params.push(`%${state}%`); }
    if (category) { conditions.push(`c.category = $${idx++}`); params.push(category); }
    if (mode) { conditions.push(`c.mode = $${idx++}`); params.push(mode); }
    if (is_free !== undefined) { conditions.push(`c.is_free = $${idx++}`); params.push(is_free === 'true'); }
    if (search) { conditions.push(`(c.title ILIKE $${idx} OR c.description ILIKE $${idx++})`); params.push(`%${search}%`); }
    const where = 'WHERE ' + conditions.join(' AND ');
    const countResult = await pool.query(`SELECT COUNT(*) FROM courses c ${where}`, params);
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT c.*, o.org_name FROM courses c LEFT JOIN organizations o ON o.id = c.org_id ${where} ORDER BY c.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      params
    );
    res.json({ success: true, data: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.*, o.org_name, o.logo_url FROM courses c LEFT JOIN organizations o ON o.id = c.org_id WHERE c.id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const orgResult = await pool.query('SELECT id FROM organizations WHERE user_id = $1', [req.user.id]);
    if (!orgResult.rows[0]) return res.status(403).json({ success: false, message: 'Organization profile required' });
    const { title, description, duration, mode, language, skills_taught, certification, is_free, fee, location_state, location_district, start_date, end_date, seats, category } = req.body;
    const result = await pool.query(
      'INSERT INTO courses (org_id, title, description, duration, mode, language, skills_taught, certification, is_free, fee, location_state, location_district, start_date, end_date, seats, category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *',
      [orgResult.rows[0].id, title, description, duration, mode, language, skills_taught, certification, is_free, fee, location_state, location_district, start_date, end_date, seats, category]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
