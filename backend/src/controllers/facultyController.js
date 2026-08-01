const { Faculty, User, Department } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

/**
 * @desc    Get all faculty
 * @route   GET /api/faculty
 */
const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['designation', 'qualification', '$user.username$', '$user.email$'],
      { department_id: 'department_id' }
    );

    const { count, rows } = await Faculty.findAndCountAll({
      where,
      include: [
        { association: 'user', attributes: ['id', 'username', 'email', 'status'] },
        { association: 'department', attributes: ['department_id', 'department_name'] }
      ],
      order,
      limit,
      offset,
      distinct: true
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get faculty by ID
 * @route   GET /api/faculty/:id
 */
const getById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' },
        {
          association: 'courseOfferings',
          include: [{ association: 'course' }]
        }
      ]
    });

    if (!faculty) return sendError(res, 'Faculty not found', 404);
    sendSuccess(res, faculty);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create faculty
 * @route   POST /api/faculty
 */
const create = async (req, res, next) => {
  try {
    const faculty = await Faculty.create(req.body);
    const result = await Faculty.findByPk(faculty.faculty_id, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' }
      ]
    });
    sendCreated(res, result, 'Faculty created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update faculty
 * @route   PUT /api/faculty/:id
 */
const update = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return sendError(res, 'Faculty not found', 404);

    req._oldValues = faculty.toJSON();
    await faculty.update(req.body);

    const result = await Faculty.findByPk(faculty.faculty_id, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' }
      ]
    });
    sendSuccess(res, result, 'Faculty updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete faculty
 * @route   DELETE /api/faculty/:id
 */
const remove = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) return sendError(res, 'Faculty not found', 404);

    await faculty.destroy();
    sendSuccess(res, null, 'Faculty deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my profile (for faculty role)
 * @route   GET /api/faculty/me/profile
 */
const getMyProfile = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({
      where: { user_id: req.user.id },
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' },
        {
          association: 'courseOfferings',
          include: [
            { association: 'course' },
            { association: 'enrollments', include: [{ association: 'student', include: [{ association: 'user', attributes: ['username'] }] }] }
          ]
        }
      ]
    });

    if (!faculty) return sendError(res, 'Faculty profile not found', 404);
    sendSuccess(res, faculty);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, getMyProfile };
