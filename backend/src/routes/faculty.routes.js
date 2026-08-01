const router = require('express').Router();
const ctrl = require('../controllers/facultyController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createFacultySchema, updateFacultySchema } = require('../validators');

router.get('/me/profile', authenticate, authorize('Faculty'), ctrl.getMyProfile);
router.get('/', authenticate, authorize('Admin'), ctrl.getAll);
router.get('/:id', authenticate, authorize('Admin'), ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('Faculty'), validate(createFacultySchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('Faculty'), validate(updateFacultySchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Faculty'), ctrl.remove);

module.exports = router;
