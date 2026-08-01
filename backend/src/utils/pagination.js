const { Op } = require('sequelize');

/**
 * Build pagination, search, sort, and filter options from query params
 * @param {Object} query - Express req.query
 * @param {Array} searchFields - Fields to search in (e.g., ['username', 'email'])
 * @param {Object} filterMap - Mapping of query params to column names
 * @returns {Object} { where, order, limit, offset, pagination }
 */
const buildQueryOptions = (query, searchFields = [], filterMap = {}) => {
  // Pagination
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;

  // Search
  const where = {};
  if (query.search && searchFields.length > 0) {
    where[Op.or] = searchFields.map(field => ({
      [field]: { [Op.like]: `%${query.search}%` }
    }));
  }

  // Filters
  Object.keys(filterMap).forEach(param => {
    if (query[param] !== undefined && query[param] !== '') {
      where[filterMap[param]] = query[param];
    }
  });

  // Sorting
  let order = [['created_at', 'DESC']];
  if (query.sortBy) {
    const sortDirection = (query.sortOrder || 'ASC').toUpperCase();
    const validDirections = ['ASC', 'DESC'];
    order = [[query.sortBy, validDirections.includes(sortDirection) ? sortDirection : 'ASC']];
  }

  return { where, order, limit, offset, page };
};

/**
 * Build pagination metadata from Sequelize count and query options
 */
const buildPagination = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  };
};

module.exports = { buildQueryOptions, buildPagination };
