const router = require('express').Router();
const ctrl = require('../controllers/inventoryController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', authenticate, authorize('Admin'), ctrl.getAll);
router.post('/', authenticate, authorize('Admin'), ctrl.create);

module.exports = router;
