const router = require('express').Router();
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', authenticate, authorize('org'), createJob);
router.put('/:id', authenticate, authorize('org'), updateJob);
router.delete('/:id', authenticate, authorize('org'), deleteJob);

module.exports = router;
