const router = require('express').Router();
const ctrl = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/dashboard', authenticate, authorize('Admin'), ctrl.getDashboardStats);
router.get('/department-students', authenticate, authorize('Admin'), ctrl.getDepartmentStudents);
router.get('/attendance-summary', authenticate, authorize('Admin'), ctrl.getAttendanceSummary);
router.get('/grade-distribution', authenticate, authorize('Admin'), ctrl.getGradeDistribution);
router.get('/enrollment-trends', authenticate, authorize('Admin'), ctrl.getEnrollmentTrends);
router.get('/audit-logs', authenticate, authorize('Admin'), ctrl.getAuditLogs);

module.exports = router;
