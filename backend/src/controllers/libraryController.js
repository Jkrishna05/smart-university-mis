const { Book, LibraryBorrow, Student } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getBooks = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(req.query, ['title', 'author', 'category']);
    const { count, rows } = await Book.findAndCountAll({ where, order, limit, offset });
    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) { next(error); }
};

const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    sendCreated(res, book, 'Book added to catalog');
  } catch (error) { next(error); }
};

const getBorrows = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(req.query, []);
    const { count, rows } = await LibraryBorrow.findAndCountAll({
      where,
      include: ['book', { association: 'student', include: [{ association: 'user', attributes: ['username'] }] }],
      order, limit, offset
    });
    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) { next(error); }
};

const getMyBorrows = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) return sendError(res, 'Student profile not found', 404);
    const borrows = await LibraryBorrow.findAll({
      where: { student_id: student.student_id },
      include: ['book'],
      order: [['issue_date', 'DESC']]
    });
    sendSuccess(res, borrows);
  } catch (error) { next(error); }
};

const issueBook = async (req, res, next) => {
  try {
    const { student_id, book_id, due_date } = req.body;
    const book = await Book.findByPk(book_id);
    if (!book || book.available_copies <= 0) return sendError(res, 'Book not available', 400);

    const borrow = await LibraryBorrow.create({
      student_id, book_id,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: due_date || '2025-10-30',
      status: 'Issued'
    });

    await book.decrement('available_copies');
    sendCreated(res, borrow, 'Book issued successfully');
  } catch (error) { next(error); }
};

module.exports = { getBooks, createBook, getBorrows, getMyBorrows, issueBook };
