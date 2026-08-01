const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createUserSchema, updateUserSchema } = require('../validators');

router.get('/', authenticate, authorize('Admin'), ctrl.getAll);
router.get('/:id', authenticate, authorize('Admin'), ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('User'), validate(createUserSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('User'), validate(updateUserSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('User'), ctrl.remove);

module.exports = router;
