const router = require('express').Router();
const ctrl = require('../controllers/libraryController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/my-borrows', authenticate, authorize('Student'), ctrl.getMyBorrows);
router.get('/books', authenticate, ctrl.getBooks);
router.post('/books', authenticate, authorize('Admin'), ctrl.createBook);
router.get('/borrows', authenticate, authorize('Admin'), ctrl.getBorrows);
router.post('/issue', authenticate, authorize('Admin'), ctrl.issueBook);

module.exports = router;
