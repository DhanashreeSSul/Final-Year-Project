const router = require('express').Router();
const { getSchemes, getScheme } = require('../controllers/schemesController');

router.get('/', getSchemes);
router.get('/:id', getScheme);

module.exports = router;
