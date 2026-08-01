const { Inventory, Department } = require('../models');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(req.query, ['item_name', 'category']);
    const { count, rows } = await Inventory.findAndCountAll({
      where, include: ['department'], order, limit, offset
    });
    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const item = await Inventory.create(req.body);
    sendCreated(res, item, 'Inventory item added');
  } catch (error) { next(error); }
};

module.exports = { getAll, create };
