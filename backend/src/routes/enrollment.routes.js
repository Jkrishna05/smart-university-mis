const router = require('express').Router();
const ctrl = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, enrollmentSchema } = require('../validators');

router.get('/my-enrollments', authenticate, authorize('Student'), ctrl.getMyEnrollments);
router.get('/', authenticate, authorize('Admin', 'Faculty'), ctrl.getAll);
router.get('/:id', authenticate, authorize('Admin', 'Faculty'), ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('Enrollment'), validate(enrollmentSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('Enrollment'), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Enrollment'), ctrl.remove);

module.exports = router;
