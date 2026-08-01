const router = require('express').Router();
const ctrl = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createAttendanceSchema, bulkAttendanceSchema } = require('../validators');

router.get('/my-attendance', authenticate, authorize('Student'), ctrl.getMyAttendance);
router.get('/offering', authenticate, authorize('Admin', 'Faculty'), ctrl.getOfferingAttendance);
router.get('/', authenticate, authorize('Admin', 'Faculty'), ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.post('/bulk', authenticate, authorize('Admin', 'Faculty'), auditLogger('Attendance'), validate(bulkAttendanceSchema), ctrl.bulkCreate);
router.post('/', authenticate, authorize('Admin', 'Faculty'), auditLogger('Attendance'), validate(createAttendanceSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin', 'Faculty'), auditLogger('Attendance'), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Attendance'), ctrl.remove);

module.exports = router;
