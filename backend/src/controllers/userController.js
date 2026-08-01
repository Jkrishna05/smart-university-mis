const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['username', 'email'],
      { role: 'role', status: 'status' }
    );

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order, limit, offset
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(12);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = await User.create(req.body);
    const { password, ...userData } = user.toJSON();
    sendCreated(res, userData, 'User created successfully');
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    // Hash password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(12);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    req._oldValues = { ...user.toJSON(), password: undefined };
    await user.update(req.body);

    const { password, ...userData } = user.toJSON();
    sendSuccess(res, userData, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    // Prevent self-deletion
    if (user.id === req.user.id) {
      return sendError(res, 'Cannot delete your own account', 400);
    }

    await user.destroy();
    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
