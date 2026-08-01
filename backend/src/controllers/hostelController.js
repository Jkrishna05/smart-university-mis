const { Hostel, Student, User } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(req.query, []);
    const { count, rows } = await Hostel.findAndCountAll({
      where,
      include: [{ association: 'student', include: [{ association: 'user', attributes: ['username', 'email'] }] }],
      order, limit, offset
    });
    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const hostel = await Hostel.create(req.body);
    sendCreated(res, hostel, 'Hostel room allocated');
  } catch (error) { next(error); }
};

const getMyHostel = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) return sendError(res, 'Student profile not found', 404);
    const hostel = await Hostel.findOne({ where: { student_id: student.student_id } });
    sendSuccess(res, hostel);
  } catch (error) { next(error); }
};

module.exports = { getAll, create, getMyHostel };
