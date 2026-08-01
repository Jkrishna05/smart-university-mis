const router = require('express').Router();
const ctrl = require('../controllers/feeController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');

router.get('/my-fees', authenticate, authorize('Student'), ctrl.getMyFees);
router.get('/', authenticate, authorize('Admin'), ctrl.getAll);
router.get('/:id', authenticate, authorize('Admin'), ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('Fee'), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('Fee'), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Fee'), ctrl.remove);

module.exports = router;
