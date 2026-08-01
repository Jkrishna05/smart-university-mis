const { Student, User, Department } = require('../models');
const { sendSuccess, sendCreated, sendPaginated, sendError } = require('../utils/response');
const { buildQueryOptions, buildPagination } = require('../utils/pagination');
const { exportToExcel } = require('../utils/exportExcel');
const { exportToPdf } = require('../utils/exportPdf');

/**
 * @desc    Get all students with pagination, search, sort, filter
 * @route   GET /api/students
 */
const getAll = async (req, res, next) => {
  try {
    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['roll_no', 'registration_no', '$user.username$', '$user.email$'],
      { department_id: 'department_id', semester: 'semester', year: 'year' }
    );

    const { count, rows } = await Student.findAndCountAll({
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
 * @desc    Get student by ID
 * @route   GET /api/students/:id
 */
const getById = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' },
        { association: 'enrollments', include: [{ association: 'courseOffering', include: [{ association: 'course' }, { association: 'faculty', include: [{ association: 'user', attributes: ['username'] }] }] }] }
      ]
    });

    if (!student) return sendError(res, 'Student not found', 404);
    sendSuccess(res, student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create student
 * @route   POST /api/students
 */
const create = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    const result = await Student.findByPk(student.student_id, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' }
      ]
    });
    sendCreated(res, result, 'Student created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 */
const update = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return sendError(res, 'Student not found', 404);

    req._oldValues = student.toJSON();
    await student.update(req.body);

    const result = await Student.findByPk(student.student_id, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' }
      ]
    });
    sendSuccess(res, result, 'Student updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 */
const remove = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return sendError(res, 'Student not found', 404);

    await student.destroy();
    sendSuccess(res, null, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export students to Excel
 * @route   GET /api/students/export/excel
 */
const exportExcel = async (req, res, next) => {
  try {
    const students = await Student.findAll({
      include: [
        { association: 'user', attributes: ['username', 'email'] },
        { association: 'department', attributes: ['department_name'] }
      ],
      raw: true,
      nest: true
    });

    const data = students.map(s => ({
      roll_no: s.roll_no,
      registration_no: s.registration_no,
      name: s.user.username,
      email: s.user.email,
      department: s.department.department_name,
      semester: s.semester,
      year: s.year,
      phone: s.phone || '',
      guardian_name: s.guardian_name || ''
    }));

    const columns = [
      { header: 'Roll No', key: 'roll_no', width: 15 },
      { header: 'Registration No', key: 'registration_no', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Guardian', key: 'guardian_name', width: 20 }
    ];

    await exportToExcel(res, data, columns, 'Students', 'students_list');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export students to PDF
 * @route   GET /api/students/export/pdf
 */
const exportPdf = async (req, res, next) => {
  try {
    const students = await Student.findAll({
      include: [
        { association: 'user', attributes: ['username', 'email'] },
        { association: 'department', attributes: ['department_name'] }
      ],
      raw: true,
      nest: true
    });

    const headers = ['Roll No', 'Name', 'Email', 'Department', 'Semester', 'Year'];
    const rows = students.map(s => [
      s.roll_no,
      s.user.username,
      s.user.email,
      s.department.department_name,
      s.semester,
      s.year
    ]);

    exportToPdf(res, 'Student List', headers, rows, 'students_list');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my profile (for student role)
 * @route   GET /api/students/me/profile
 */
const getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      where: { user_id: req.user.id },
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'department' }
      ]
    });

    if (!student) return sendError(res, 'Student profile not found', 404);
    sendSuccess(res, student);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove, exportExcel, exportPdf, getMyProfile };
