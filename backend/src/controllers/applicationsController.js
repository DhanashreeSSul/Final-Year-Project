const pool = require('../db/pool');

exports.apply = async (req, res) => {
  try {
    const { entity_id, entity_type, cover_letter } = req.body;
    const existing = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND entity_id = $2 AND entity_type = $3',
      [req.user.id, entity_id, entity_type]
    );
    if (existing.rows[0]) {
      return res.status(409).json({ success: false, message: 'Already applied' });
    }
    const result = await pool.query(
      'INSERT INTO applications (user_id, entity_id, entity_type, cover_letter) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, entity_id, entity_type, cover_letter || null]
    );
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'Application Submitted', 'Your application for ' + entity_type + ' has been submitted successfully.', 'application']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const query = `
      SELECT
        a.*,
        CASE
          WHEN a.entity_type = 'job'    THEN j.title
          WHEN a.entity_type = 'course' THEN c.title
          WHEN a.entity_type = 'scheme' THEN s.title
        END AS entity_title
      FROM applications a
      LEFT JOIN jobs    j ON j.id = a.entity_id AND a.entity_type = 'job'
      LEFT JOIN courses c ON c.id = a.entity_id AND a.entity_type = 'course'
      LEFT JOIN schemes s ON s.id = a.entity_id AND a.entity_type = 'scheme'
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
