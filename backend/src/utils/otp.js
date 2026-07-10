const bcrypt = require('bcryptjs');
const pool = require('../db/pool');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const saveOTP = async (phone, email, otp, purpose) => {
  const hash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await pool.query(
    'INSERT INTO otps (phone, email, otp_hash, purpose, expires_at) VALUES ($1, $2, $3, $4, $5)',
    [phone || null, email || null, hash, purpose, expiresAt]
  );
  return otp;
};

const verifyOTP = async (phone, email, otp, purpose) => {
  const result = await pool.query(
    'SELECT * FROM otps WHERE (phone = $1 OR email = $2) AND purpose = $3 AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    [phone || null, email || null, purpose]
  );
  if (!result.rows[0]) return false;
  const valid = await bcrypt.compare(otp, result.rows[0].otp_hash);
  if (valid) await pool.query('UPDATE otps SET is_used = TRUE WHERE id = $1', [result.rows[0].id]);
  return valid;
};

module.exports = { generateOTP, saveOTP, verifyOTP };
