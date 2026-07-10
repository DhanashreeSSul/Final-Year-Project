const router = require('express').Router();
const { getOrg, upsertOrg, getOrgDashboard } = require('../controllers/organizationsController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get('/my', getOrg);
router.post('/my', upsertOrg);
router.get('/dashboard', authorize('org'), getOrgDashboard);

module.exports = router;
