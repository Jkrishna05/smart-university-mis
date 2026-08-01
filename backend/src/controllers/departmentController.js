const { Department, Course, Student, Faculty } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['department_name'],
      {}
    );

    const { count, rows } = await Department.findAndCountAll({
      where, order, limit, offset, distinct: true
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [
        { association: 'courses' },
        { association: 'students', include: [{ association: 'user', attributes: ['username', 'email'] }] },
        { association: 'facultyMembers', include: [{ association: 'user', attributes: ['username', 'email'] }] }
      ]
    });

    if (!department) return sendError(res, 'Department not found', 404);
    sendSuccess(res, department);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    sendCreated(res, department, 'Department created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return sendError(res, 'Department not found', 404);

    req._oldValues = department.toJSON();
    await department.update(req.body);
    sendSuccess(res, department, 'Department updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return sendError(res, 'Department not found', 404);

    await department.destroy();
    sendSuccess(res, null, 'Department deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
