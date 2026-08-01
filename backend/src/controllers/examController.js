const { Exam, Course } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['exam_name'],
      { course_id: 'course_id' }
    );

    const { count, rows } = await Exam.findAndCountAll({
      where,
      include: [{ association: 'course', attributes: ['course_id', 'course_name', 'course_code'] }],
      order, limit, offset, distinct: true
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        { association: 'course', include: [{ association: 'department' }] },
        { association: 'results', include: [{ association: 'student', include: [{ association: 'user', attributes: ['username'] }] }] }
      ]
    });

    if (!exam) return sendError(res, 'Exam not found', 404);
    sendSuccess(res, exam);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    const result = await Exam.findByPk(exam.exam_id, {
      include: [{ association: 'course' }]
    });
    sendCreated(res, result, 'Exam created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return sendError(res, 'Exam not found', 404);

    req._oldValues = exam.toJSON();
    await exam.update(req.body);

    const result = await Exam.findByPk(exam.exam_id, {
      include: [{ association: 'course' }]
    });
    sendSuccess(res, result, 'Exam updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return sendError(res, 'Exam not found', 404);

    await exam.destroy();
    sendSuccess(res, null, 'Exam deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get exam schedule for student's enrolled courses
 */
const getMyExamSchedule = async (req, res, next) => {
  try {
    const { Student, Enrollment, CourseOffering } = require('../models');
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) return sendError(res, 'Student profile not found', 404);

    const enrollments = await Enrollment.findAll({
      where: { student_id: student.student_id },
      include: [{ association: 'courseOffering', attributes: ['course_id'] }]
    });

    const courseIds = enrollments.map(e => e.courseOffering.course_id);

    const exams = await Exam.findAll({
      where: { course_id: courseIds },
      include: [{ association: 'course', attributes: ['course_name', 'course_code'] }],
      order: [['exam_date', 'ASC']]
    });

    sendSuccess(res, exams);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, getMyExamSchedule };
