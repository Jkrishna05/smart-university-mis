const { CourseOffering, Course, Faculty, Enrollment, Student, User } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['section', '$course.course_name$'],
      { course_id: 'course_id', faculty_id: 'faculty_id', semester: 'semester', year: 'year' }
    );

    const { count, rows } = await CourseOffering.findAndCountAll({
      where,
      include: [
        { association: 'course', attributes: ['course_id', 'course_name', 'course_code', 'credits'] },
        { association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }
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
    const offering = await CourseOffering.findByPk(req.params.id, {
      include: [
        { association: 'course', include: [{ association: 'department' }] },
        { association: 'faculty', include: [{ association: 'user', attributes: { exclude: ['password'] } }] },
        { association: 'enrollments', include: [{ association: 'student', include: [{ association: 'user', attributes: ['username', 'email'] }] }] }
      ]
    });

    if (!offering) return sendError(res, 'Course offering not found', 404);
    sendSuccess(res, offering);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const offering = await CourseOffering.create(req.body);
    const result = await CourseOffering.findByPk(offering.offering_id, {
      include: [
        { association: 'course' },
        { association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }
      ]
    });
    sendCreated(res, result, 'Course offering created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) return sendError(res, 'Course offering not found', 404);

    req._oldValues = offering.toJSON();
    await offering.update(req.body);

    const result = await CourseOffering.findByPk(offering.offering_id, {
      include: [
        { association: 'course' },
        { association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }
      ]
    });
    sendSuccess(res, result, 'Course offering updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) return sendError(res, 'Course offering not found', 404);

    await offering.destroy();
    sendSuccess(res, null, 'Course offering deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get offerings assigned to a faculty member
 */
const getMyOfferings = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.user.id } });
    if (!faculty) return sendError(res, 'Faculty profile not found', 404);

    const offerings = await CourseOffering.findAll({
      where: { faculty_id: faculty.faculty_id },
      include: [
        { association: 'course', include: [{ association: 'department' }] },
        { association: 'enrollments', include: [{ association: 'student', include: [{ association: 'user', attributes: ['username', 'email'] }] }] }
      ]
    });

    sendSuccess(res, offerings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, getMyOfferings };
