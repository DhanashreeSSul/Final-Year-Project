const pool = require('../db/pool');

exports.getStats = async (req, res) => {
  try {
    const [users, jobs, courses, schemes, apps] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'"),
      pool.query('SELECT COUNT(*) FROM jobs WHERE is_active = TRUE'),
      pool.query('SELECT COUNT(*) FROM courses WHERE is_active = TRUE'),
      pool.query('SELECT COUNT(*) FROM schemes WHERE is_active = TRUE'),
      pool.query('SELECT COUNT(*) FROM applications'),
    ]);
    res.json({
      success: true,
      data: {
        total_women: parseInt(users.rows[0].count),
        active_jobs: parseInt(jobs.rows[0].count),
        active_courses: parseInt(courses.rows[0].count),
        active_schemes: parseInt(schemes.rows[0].count),
        total_applications: parseInt(apps.rows[0].count)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
