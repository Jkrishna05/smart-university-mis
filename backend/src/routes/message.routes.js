const router = require('express').Router();
const ctrl = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, ctrl.getMyMessages);
router.post('/', authenticate, ctrl.sendMessage);

module.exports = router;
