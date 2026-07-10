const router = require('express').Router();
const { getStats } = require('../controllers/analyticsController');

router.get('/stats', getStats);

module.exports = router;
