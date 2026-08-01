const { Enrollment, Student, CourseOffering, Course, Faculty, User } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query, [],
      { student_id: 'student_id', offering_id: 'offering_id' }
    );

    const { count, rows } = await Enrollment.findAndCountAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['username', 'email'] }] },
        { association: 'courseOffering', include: [{ association: 'course' }, { association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }] }
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
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { association: 'student', include: [{ association: 'user', attributes: { exclude: ['password'] } }] },
        { association: 'courseOffering', include: [{ association: 'course' }, { association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }] }
      ]
    });

    if (!enrollment) return sendError(res, 'Enrollment not found', 404);
    sendSuccess(res, enrollment);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    // Check for duplicate enrollment
    const existing = await Enrollment.findOne({
      where: { student_id: req.body.student_id, offering_id: req.body.offering_id }
    });
    if (existing) return sendError(res, 'Student is already enrolled in this course offering', 409);

    const enrollment = await Enrollment.create(req.body);
    const result = await Enrollment.findByPk(enrollment.enrollment_id, {
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['username'] }] },
        { association: 'courseOffering', include: [{ association: 'course' }] }
      ]
    });
    sendCreated(res, result, 'Enrollment created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return sendError(res, 'Enrollment not found', 404);

    req._oldValues = enrollment.toJSON();
    await enrollment.update(req.body);
    sendSuccess(res, enrollment, 'Enrollment updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return sendError(res, 'Enrollment not found', 404);

    await enrollment.destroy();
    sendSuccess(res, null, 'Enrollment deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my enrollments (for student role)
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) return sendError(res, 'Student profile not found', 404);

    const enrollments = await Enrollment.findAll({
      where: { student_id: student.student_id },
      include: [
        { association: 'courseOffering', include: [
          { association: 'course', include: [{ association: 'department' }] },
          { association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }
        ]}
      ]
    });

    sendSuccess(res, enrollments);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, getMyEnrollments };
