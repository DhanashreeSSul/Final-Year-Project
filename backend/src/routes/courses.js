const router = require('express').Router();
const { getCourses, getCourse, createCourse } = require('../controllers/coursesController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', authenticate, authorize('org'), createCourse);

module.exports = router;
