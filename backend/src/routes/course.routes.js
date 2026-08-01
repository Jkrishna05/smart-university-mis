const router = require('express').Router();
const ctrl = require('../controllers/courseController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createCourseSchema, updateCourseSchema } = require('../validators');

router.get('/', authenticate, ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('Course'), validate(createCourseSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('Course'), validate(updateCourseSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Course'), ctrl.remove);

module.exports = router;
