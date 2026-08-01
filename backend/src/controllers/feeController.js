const { Fee, Student, User } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');

/**
 * @desc    Get all student fees (Admin view)
 */
const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query, [],
      { student_id: 'student_id', status: 'status', semester: 'semester' }
    );

    const { count, rows } = await Fee.findAndCountAll({
      where,
      include: [{ association: 'student', include: [{ association: 'user', attributes: ['username', 'email'] }] }],
      order, limit, offset, distinct: true
    });

    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get fee by ID
 */
const getById = async (req, res, next) => {
  try {
    const fee = await Fee.findByPk(req.params.id, {
      include: [{ association: 'student', include: [{ association: 'user', attributes: ['username', 'email'] }] }]
    });

    if (!fee) return sendError(res, 'Fee record not found', 404);
    sendSuccess(res, fee);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create/Generate student fee bill (Admin only)
 */
const create = async (req, res, next) => {
  try {
    const { student_id, semester, academic_year, tuition_fee, exam_fee, hostel_fee, paid_amount, due_date } = req.body;

    const total_amount = (parseFloat(tuition_fee || 45000) + parseFloat(exam_fee || 3000) + parseFloat(hostel_fee || 12000));
    const paid = parseFloat(paid_amount || 0);
    const due_amount = total_amount - paid;
    const status = due_amount <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

    const fee = await Fee.create({
      student_id,
      semester,
      academic_year: academic_year || 2025,
      tuition_fee: tuition_fee || 45000,
      exam_fee: exam_fee || 3000,
      hostel_fee: hostel_fee || 12000,
      total_amount,
      paid_amount: paid,
      due_amount,
      status,
      due_date: due_date || '2025-10-31'
    });

    const result = await Fee.findByPk(fee.fee_id, {
      include: [{ association: 'student', include: [{ association: 'user', attributes: ['username'] }] }]
    });

    sendCreated(res, result, 'Fee record generated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update/Record payment for student fee (Admin only)
 */
const update = async (req, res, next) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return sendError(res, 'Fee record not found', 404);

    const tuition = req.body.tuition_fee !== undefined ? parseFloat(req.body.tuition_fee) : parseFloat(fee.tuition_fee);
    const exam = req.body.exam_fee !== undefined ? parseFloat(req.body.exam_fee) : parseFloat(fee.exam_fee);
    const hostel = req.body.hostel_fee !== undefined ? parseFloat(req.body.hostel_fee) : parseFloat(fee.hostel_fee);
    const paid = req.body.paid_amount !== undefined ? parseFloat(req.body.paid_amount) : parseFloat(fee.paid_amount);

    const total = tuition + exam + hostel;
    const due = Math.max(0, total - paid);
    const status = due <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

    req._oldValues = fee.toJSON();
    await fee.update({
      ...req.body,
      tuition_fee: tuition,
      exam_fee: exam,
      hostel_fee: hostel,
      total_amount: total,
      paid_amount: paid,
      due_amount: due,
      status
    });

    sendSuccess(res, fee, 'Fee record updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete fee record (Admin only)
 */
const remove = async (req, res, next) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return sendError(res, 'Fee record not found', 404);

    await fee.destroy();
    sendSuccess(res, null, 'Fee record deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my fee details (Student self-view)
 */
const getMyFees = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) return sendError(res, 'Student profile not found', 404);

    const fees = await Fee.findAll({
      where: { student_id: student.student_id },
      order: [['semester', 'DESC']]
    });

    sendSuccess(res, fees);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, getMyFees };
