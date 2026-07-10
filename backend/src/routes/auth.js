const router = require('express').Router();
const { sendOTP, register, login, resetPassword, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, me);

module.exports = router;
