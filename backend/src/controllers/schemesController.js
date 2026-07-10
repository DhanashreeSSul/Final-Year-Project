const pool = require('../db/pool');

exports.getSchemes = async (req, res) => {
  try {
    const { state, category, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let conditions = ['is_active = TRUE'];
    let params = [];
    let idx = 1;
    if (state) { conditions.push(`(state = $${idx} OR state = 'All')`); params.push(state); idx++; }
    if (category) { conditions.push(`category = $${idx++}`); params.push(category); }
    if (search) { conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx++})`); params.push(`%${search}%`); }
    const where = 'WHERE ' + conditions.join(' AND ');
    const countResult = await pool.query(`SELECT COUNT(*) FROM schemes ${where}`, params);
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT * FROM schemes ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx+1}`, params
    );
    res.json({ success: true, data: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getScheme = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schemes WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
