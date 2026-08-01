const router = require('express').Router();
const ctrl = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createStudentSchema, updateStudentSchema } = require('../validators');

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: department_id
 *         schema: { type: integer }
 *       - in: query
 *         name: semester
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated student list
 */
router.get('/export/excel', authenticate, authorize('Admin'), ctrl.exportExcel);
router.get('/export/pdf', authenticate, authorize('Admin'), ctrl.exportPdf);
router.get('/me/profile', authenticate, authorize('Student'), ctrl.getMyProfile);
router.get('/', authenticate, authorize('Admin', 'Faculty'), ctrl.getAll);
router.get('/:id', authenticate, authorize('Admin', 'Faculty'), ctrl.getById);
router.post('/', authenticate, authorize('Admin'), auditLogger('Student'), validate(createStudentSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin'), auditLogger('Student'), validate(updateStudentSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Student'), ctrl.remove);

module.exports = router;
