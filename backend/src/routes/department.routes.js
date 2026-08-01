const router = require('express').Router();
const ctrl = require('../controllers/departmentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, departmentSchema } = require('../validators');

router.get('/', authenticate, ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('Department'), validate(departmentSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('Department'), validate(departmentSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Department'), ctrl.remove);

module.exports = router;
