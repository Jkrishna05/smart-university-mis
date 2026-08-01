const { User, Student, Faculty, Department, Course, CourseOffering, Enrollment, Attendance, Exam, Result } = require('../models');
const { sendSuccess } = require('../utils/response');
const { Op, fn, col, literal } = require('sequelize');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/reports/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalEnrollments,
      activeUsers
    ] = await Promise.all([
      Student.count(),
      Faculty.count(),
      Department.count(),
      Course.count(),
      Enrollment.count(),
      User.count({ where: { status: 'active' } })
    ]);

    sendSuccess(res, {
      totalStudents,
      totalFaculty,
      totalDepartments,
      totalCourses,
      totalEnrollments,
      activeUsers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get department-wise student count
 * @route   GET /api/reports/department-students
 */
const getDepartmentStudents = async (req, res, next) => {
  try {
    const departments = await Department.findAll({
      attributes: [
        'department_id',
        'department_name',
        [fn('COUNT', col('students.student_id')), 'student_count']
      ],
      include: [{
        association: 'students',
        attributes: [],
        duplicating: false
      }],
      group: ['Department.department_id'],
      raw: true
    });

    sendSuccess(res, departments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance summary
 * @route   GET /api/reports/attendance-summary
 */
const getAttendanceSummary = async (req, res, next) => {
  try {
    const summary = await Attendance.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('attendance_id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get grade distribution
 * @route   GET /api/reports/grade-distribution
 */
const getGradeDistribution = async (req, res, next) => {
  try {
    const distribution = await Result.findAll({
      attributes: [
        'grade',
        [fn('COUNT', col('result_id')), 'count']
      ],
      group: ['grade'],
      raw: true
    });

    sendSuccess(res, distribution);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get enrollment trends (by semester)
 * @route   GET /api/reports/enrollment-trends
 */
const getEnrollmentTrends = async (req, res, next) => {
  try {
    const trends = await CourseOffering.findAll({
      attributes: [
        'semester',
        'year',
        [fn('COUNT', col('enrollments.enrollment_id')), 'enrollment_count']
      ],
      include: [{
        association: 'enrollments',
        attributes: [],
        duplicating: false
      }],
      group: ['semester', 'year'],
      order: [['year', 'ASC'], ['semester', 'ASC']],
      raw: true
    });

    sendSuccess(res, trends);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get audit logs
 * @route   GET /api/reports/audit-logs
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const { AuditLog } = require('../models');
    const { buildQueryOptions, buildPagination } = require('../utils/pagination');

    const { where, order, limit, offset, page } = buildQueryOptions(
      req.query,
      ['action', 'entity'],
      { user_id: 'user_id', action: 'action', entity: 'entity' }
    );

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [{ association: 'user', attributes: ['username', 'email'] }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const { sendPaginated } = require('../utils/response');
    sendPaginated(res, rows, buildPagination(count, page, limit));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getDepartmentStudents,
  getAttendanceSummary,
  getGradeDistribution,
  getEnrollmentTrends,
  getAuditLogs
};
