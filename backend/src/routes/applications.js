const router = require('express').Router();
const { apply, getUserApplications, updateStatus } = require('../controllers/applicationsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.post('/', apply);
router.get('/my', getUserApplications);
router.patch('/:id/status', updateStatus);

module.exports = router;
