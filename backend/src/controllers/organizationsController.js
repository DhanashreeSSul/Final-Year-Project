const pool = require('../db/pool');

exports.getOrg = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM organizations WHERE user_id = $1', [req.user.id]);
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.upsertOrg = async (req, res) => {
  try {
    const { org_name, org_type, registration_number, description, website, address, state, district, contact_person } = req.body;
    const existing = await pool.query('SELECT id FROM organizations WHERE user_id = $1', [req.user.id]);
    let result;
    if (existing.rows[0]) {
      result = await pool.query(
        'UPDATE organizations SET org_name=$1, org_type=$2, registration_number=$3, description=$4, website=$5, address=$6, state=$7, district=$8, contact_person=$9, updated_at=NOW() WHERE user_id=$10 RETURNING *',
        [org_name, org_type, registration_number, description, website, address, state, district, contact_person, req.user.id]
      );
    } else {
      result = await pool.query(
        'INSERT INTO organizations (user_id, org_name, org_type, registration_number, description, website, address, state, district, contact_person) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
        [req.user.id, org_name, org_type, registration_number, description, website, address, state, district, contact_person]
      );
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrgDashboard = async (req, res) => {
  try {
    const org = await pool.query('SELECT id FROM organizations WHERE user_id = $1', [req.user.id]);
    if (!org.rows[0]) return res.status(404).json({ success: false, message: 'Organization not found' });
    const orgId = org.rows[0].id;
    const [jobs, courses, applications] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM jobs WHERE org_id = $1 AND is_active = TRUE', [orgId]),
      pool.query('SELECT COUNT(*) FROM courses WHERE org_id = $1 AND is_active = TRUE', [orgId]),
      pool.query("SELECT COUNT(*) FROM applications a JOIN jobs j ON j.id = a.entity_id WHERE j.org_id = $1 AND a.entity_type = 'job'", [orgId]),
    ]);
    res.json({
      success: true,
      data: {
        active_jobs: parseInt(jobs.rows[0].count),
        active_courses: parseInt(courses.rows[0].count),
        total_applications: parseInt(applications.rows[0].count)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
