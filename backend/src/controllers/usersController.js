const pool = require('../db/pool');

exports.updateProfile = async (req, res) => {
  try {
    const { name, state, district, village, language_pref, age, education, skills, interests, languages_known, work_experience, bio } = req.body;
    
    await pool.query(
      'UPDATE users SET name = COALESCE($1, name), state = COALESCE($2, state), district = COALESCE($3, district), village = COALESCE($4, village), language_pref = COALESCE($5, language_pref), updated_at = NOW() WHERE id = $6',
      [name, state, district, village, language_pref, req.user.id]
    );

    const profileResult = await pool.query('SELECT id FROM user_profiles WHERE user_id = $1', [req.user.id]);
    
    if (profileResult.rows[0]) {
      await pool.query(
        'UPDATE user_profiles SET age = COALESCE($1, age), education = COALESCE($2, education), skills = COALESCE($3, skills), interests = COALESCE($4, interests), languages_known = COALESCE($5, languages_known), work_experience = COALESCE($6, work_experience), bio = COALESCE($7, bio), updated_at = NOW() WHERE user_id = $8',
        [age, education, skills, interests, languages_known, work_experience, bio, req.user.id]
      );
    } else {
      await pool.query(
        'INSERT INTO user_profiles (user_id, age, education, skills, interests, languages_known, work_experience, bio) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [req.user.id, age, education, skills, interests, languages_known, work_experience, bio]
      );
    }

    await pool.query('UPDATE users SET profile_complete = TRUE WHERE id = $1', [req.user.id]);
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.bookmarkToggle = async (req, res) => {
  try {
    const { entity_id, entity_type } = req.body;
    const existing = await pool.query('SELECT id FROM bookmarks WHERE user_id = $1 AND entity_id = $2 AND entity_type = $3', [req.user.id, entity_id, entity_type]);
    if (existing.rows[0]) {
      await pool.query('DELETE FROM bookmarks WHERE id = $1', [existing.rows[0].id]);
      return res.json({ success: true, bookmarked: false });
    }
    await pool.query('INSERT INTO bookmarks (user_id, entity_id, entity_type) VALUES ($1,$2,$3)', [req.user.id, entity_id, entity_type]);
    res.json({ success: true, bookmarked: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
