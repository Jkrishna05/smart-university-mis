const { Result, Student, Exam, Course } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query, [],
      { student_id: 'student_id', exam_id: 'exam_id', grade: 'grade' }
    );

    const { count, rows } = await Result.findAndCountAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['username'] }] },
        { association: 'exam', include: [{ association: 'course', attributes: ['course_name', 'course_code'] }] }
      ],
      order, limit, offset, distinct: true
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await Result.findByPk(req.params.id, {
      include: [
        { association: 'student', include: [{ association: 'user', attributes: { exclude: ['password'] } }] },
        { association: 'exam', include: [{ association: 'course' }] }
      ]
    });

    if (!result) return sendError(res, 'Result not found', 404);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    // Auto-calculate grade
    if (!req.body.grade) {
      const exam = await Exam.findByPk(req.body.exam_id);
      if (exam) {
        const percentage = (req.body.marks / exam.total_marks) * 100;
        req.body.grade = calculateGrade(percentage);
      }
    }

    const result = await Result.create(req.body);
    const record = await Result.findByPk(result.result_id, {
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['username'] }] },
        { association: 'exam', include: [{ association: 'course', attributes: ['course_name'] }] }
      ]
    });
    sendCreated(res, record, 'Result created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await Result.findByPk(req.params.id);
    if (!result) return sendError(res, 'Result not found', 404);

    // Auto-calculate grade if marks changed
    if (req.body.marks !== undefined && !req.body.grade) {
      const exam = await Exam.findByPk(result.exam_id);
      if (exam) {
        const percentage = (req.body.marks / exam.total_marks) * 100;
        req.body.grade = calculateGrade(percentage);
      }
    }

    req._oldValues = result.toJSON();
    await result.update(req.body);

    const record = await Result.findByPk(result.result_id, {
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['username'] }] },
        { association: 'exam', include: [{ association: 'course', attributes: ['course_name'] }] }
      ]
    });
    sendSuccess(res, record, 'Result updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await Result.findByPk(req.params.id);
    if (!result) return sendError(res, 'Result not found', 404);

    await result.destroy();
    sendSuccess(res, null, 'Result deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my results (for student role)
 */
const getMyResults = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) return sendError(res, 'Student profile not found', 404);

    const results = await Result.findAll({
      where: { student_id: student.student_id },
      include: [
        { association: 'exam', include: [{ association: 'course', attributes: ['course_name', 'course_code'] }] }
      ],
      order: [['created_at', 'DESC']]
    });

    sendSuccess(res, results);
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate grade from percentage
 */
const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'A-';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'B-';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

module.exports = { getAll, getById, create, update, remove, getMyResults };
