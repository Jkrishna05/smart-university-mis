const { Attendance, Student, CourseOffering, Course, User } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

/**
 * @desc    Get all attendance records (with Section filtering for Admin)
 */
const getAll = async (req, res, next) => {
  try {
    const { offering_id, section, date, page = 1, limit = 10 } = req.query;
    const where = {};
    if (date) where.date = date;
    if (offering_id) where.offering_id = offering_id;

    const offeringWhere = {};
    if (section) offeringWhere.section = section;

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const { count, rows } = await Attendance.findAndCountAll({
      where,
      include: [
        {
          association: 'courseOffering',
          where: Object.keys(offeringWhere).length > 0 ? offeringWhere : undefined,
          include: [{ association: 'course', attributes: ['course_name', 'course_code'] }]
        },
        {
          association: 'student',
          include: [{ association: 'user', attributes: ['username', 'email'] }]
        }
      ],
      order: [
        ['date', 'DESC'],
        [{ model: Student, as: 'student' }, { model: User, as: 'user' }, 'username', 'ASC']
      ],
      limit: parseInt(limit, 10),
      offset,
      distinct: true
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance by ID
 */
const getById = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id, {
      include: ['student', { association: 'courseOffering', include: ['course'] }]
    });
    if (!attendance) return sendError(res, 'Attendance record not found', 404);
    sendSuccess(res, attendance);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance by offering ID & date
 */
const getByOffering = async (req, res, next) => {
  try {
    const { offering_id, date } = req.query;
    if (!offering_id) return sendError(res, 'Offering ID is required', 400);

    const where = { offering_id };
    if (date) where.date = date;

    const records = await Attendance.findAll({
      where,
      include: [{ association: 'student', include: [{ association: 'user', attributes: ['username'] }] }],
      order: [[{ model: Student, as: 'student' }, { model: User, as: 'user' }, 'username', 'ASC']]
    });

    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk mark/update attendance
 */
const bulkMark = async (req, res, next) => {
  try {
    const { offering_id, date, records } = req.body;
    if (!offering_id || !date || !records || !Array.isArray(records)) {
      return sendError(res, 'Invalid request body', 400);
    }

    const operations = records.map(r => 
      Attendance.upsert({
        student_id: r.student_id,
        offering_id,
        date,
        status: r.status
      })
    );

    await Promise.all(operations);
    sendSuccess(res, null, 'Attendance updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create single attendance record
 */
const create = async (req, res, next) => {
  try {
    const attendance = await Attendance.create(req.body);
    sendCreated(res, attendance, 'Attendance recorded');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update single attendance record
 */
const update = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return sendError(res, 'Attendance record not found', 404);
    await attendance.update(req.body);
    sendSuccess(res, attendance, 'Attendance updated');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete attendance record
 */
const remove = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return sendError(res, 'Attendance record not found', 404);
    await attendance.destroy();
    sendSuccess(res, null, 'Attendance deleted');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my attendance (Student view)
 */
const getMyAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) return sendError(res, 'Student profile not found', 404);

    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const { count, rows } = await Attendance.findAndCountAll({
      where: { student_id: student.student_id },
      include: [{ association: 'courseOffering', include: ['course'] }],
      order: [['date', 'DESC']],
      limit: parseInt(limit, 10),
      offset
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  getByOffering,
  getOfferingAttendance: getByOffering,
  bulkMark,
  bulkCreate: bulkMark,
  create,
  update,
  remove,
  getMyAttendance
};
