const router = require('express').Router();
const ctrl = require('../controllers/courseOfferingController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createCourseOfferingSchema, updateCourseOfferingSchema } = require('../validators');

router.get('/my-offerings', authenticate, authorize('Faculty'), ctrl.getMyOfferings);
router.get('/', authenticate, ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('CourseOffering'), validate(createCourseOfferingSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('CourseOffering'), validate(updateCourseOfferingSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('CourseOffering'), ctrl.remove);

module.exports = router;
