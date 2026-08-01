const router = require('express').Router();
const ctrl = require('../controllers/examController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createExamSchema, updateExamSchema } = require('../validators');

router.get('/my-schedule', authenticate, authorize('Student'), ctrl.getMyExamSchedule);
router.get('/', authenticate, ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, authorize('Admin', 'Faculty'), auditLogger('Exam'), validate(createExamSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin', 'Faculty'), auditLogger('Exam'), validate(updateExamSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin', 'Faculty'), auditLogger('Exam'), ctrl.remove);

module.exports = router;
