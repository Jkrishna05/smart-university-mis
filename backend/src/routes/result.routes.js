const router = require('express').Router();
const ctrl = require('../controllers/resultController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { auditLogger } = require('../middleware/auditLogger');
const { validate, createResultSchema, updateResultSchema } = require('../validators');

router.get('/my-results', authenticate, authorize('Student'), ctrl.getMyResults);
router.get('/', authenticate, authorize('Admin', 'Faculty'), ctrl.getAll);
router.get('/:id', authenticate, ctrl.getById);
router.post('/', authenticate, authorize('Admin', 'Faculty'), auditLogger('Result'), validate(createResultSchema), ctrl.create);
router.put('/:id', authenticate, authorize('Admin', 'Faculty'), auditLogger('Result'), validate(updateResultSchema), ctrl.update);
router.delete('/:id', authenticate, authorize('Admin'), auditLogger('Result'), ctrl.remove);

module.exports = router;
