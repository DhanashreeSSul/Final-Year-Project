const router = require('express').Router();
const {
  getRecommendations,
  getJobRecommendations,
  getCourseRecommendations,
  recordFeedback,
} = require('../controllers/recommendationsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Full recommendations dashboard (jobs + courses + schemes + profile tips)
router.get('/', getRecommendations);

// Standalone endpoints — used directly by Jobs and Courses pages
router.get('/jobs', getJobRecommendations);
router.get('/courses', getCourseRecommendations);

// Implicit feedback for improving recommendations
router.post('/feedback', recordFeedback);

module.exports = router;
