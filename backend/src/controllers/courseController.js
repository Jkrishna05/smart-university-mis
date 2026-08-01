const { Course, Department } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['course_name', 'course_code'],
      { department_id: 'department_id' }
    );

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: [{ association: 'department', attributes: ['department_id', 'department_name'] }],
      order, limit, offset, distinct: true
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { association: 'department' },
        { association: 'offerings', include: [{ association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }] },
        { association: 'exams' }
      ]
    });

    if (!course) return sendError(res, 'Course not found', 404);
    sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    const result = await Course.findByPk(course.course_id, {
      include: [{ association: 'department' }]
    });
    sendCreated(res, result, 'Course created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return sendError(res, 'Course not found', 404);

    req._oldValues = course.toJSON();
    await course.update(req.body);

    const result = await Course.findByPk(course.course_id, {
      include: [{ association: 'department' }]
    });
    sendSuccess(res, result, 'Course updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return sendError(res, 'Course not found', 404);

    await course.destroy();
    sendSuccess(res, null, 'Course deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
