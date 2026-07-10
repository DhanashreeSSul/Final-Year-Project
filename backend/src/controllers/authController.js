const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { generateToken } = require('../utils/jwt');
const { generateOTP, saveOTP, verifyOTP } = require('../utils/otp');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


exports.sendOTP = async (req, res) => {
  try {
    const { phone, purpose = 'register' } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone required'
      });
    }

    const otp = generateOTP();
    await saveOTP(phone, null, otp, purpose);

    // Send SMS via Twilio
    await client.messages.create({
      body: `Your Shakti OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone}`
    });

    res.json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, otp, role = 'user', language_pref = 'en', state, district, village } = req.body;
    const otpValid = await verifyOTP(phone, null, otp, 'register');
    if (!otpValid) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows[0]) return res.status(409).json({ success: false, message: 'Phone already registered' });
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (name, phone, email, password_hash, role, language_pref, state, district, village, is_verified) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE) RETURNING id, name, phone, email, role, language_pref',
      [name, phone, email || null, hash, role, language_pref, state || null, district || null, village || null]
    );
    const user = result.rows[0];
    // Create empty profile
    await pool.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [user.id]);
    const token = generateToken({ id: user.id, role: user.role });
    res.status(201).json({ success: true, message: 'Registration successful', token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const result = await pool.query(
      'SELECT id, name, phone, email, password_hash, role, language_pref, is_active FROM users WHERE phone = $1',
      [phone]
    );
    const user = result.rows[0];
    if (!user || !user.is_active) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken({ id: user.id, role: user.role });
    const { password_hash, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const valid = await verifyOTP(phone, null, otp, 'reset');
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = $1 WHERE phone = $2', [hash, phone]);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.*, p.* FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.id = $1',
      [req.user.id]
    );
    const { password_hash, ...user } = result.rows[0];
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
