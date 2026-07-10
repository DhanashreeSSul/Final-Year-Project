const router = require('express').Router();
const { updateProfile, getNotifications, markNotificationRead, bookmarkToggle, getBookmarks } = require('../controllers/usersController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.put('/profile', updateProfile);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.post('/bookmarks', bookmarkToggle);
router.get('/bookmarks', getBookmarks);

module.exports = router;
