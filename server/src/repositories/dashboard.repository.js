import db from "../config/db.js";

/**
 * Total Active Students
 */
export const getTotalStudents = async () => {

    const [rows] = await db.execute(
        `
        SELECT COUNT(*) AS totalStudents
        FROM students
        WHERE status = 'active'
        `
    );

    return rows[0];

};

/**
 * Total Active Faculty
 */
export const getTotalFaculty = async () => {

    const [rows] = await db.execute(
        `
        SELECT COUNT(*) AS totalFaculty
        FROM faculty
        WHERE status = 'active'
        `
    );

    return rows[0];

};

/**
 * Total Active Departments
 */
export const getTotalDepartments = async () => {

    const [rows] = await db.execute(
        `
        SELECT COUNT(*) AS totalDepartments
        FROM departments
        WHERE status = 'active'
        `
    );

    return rows[0];

};

/**
 * Total Courses
 */
export const getTotalCourses = async () => {

    const [rows] = await db.execute(
        `
        SELECT COUNT(*) AS totalCourses
        FROM courses
        `
    );

    return rows[0];

};

/**
 * Total Course Offerings
 */
export const getTotalCourseOfferings = async () => {

    const [rows] = await db.execute(
        `
        SELECT COUNT(*) AS totalCourseOfferings
        FROM course_offerings
        `
    );

    return rows[0];

};

/**
 * Total Active Enrollments
 */
export const getTotalEnrollments = async () => {

    const [rows] = await db.execute(
        `
        SELECT COUNT(*) AS totalEnrollments
        FROM enrollments
        WHERE status = 'enrolled'
        `
    );

    return rows[0];

};

/**
 * Today's Attendance Summary
 */
export const getTodayAttendance = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            COUNT(*) AS totalRecords,

            SUM(status = 'present') AS totalPresent,

            SUM(status = 'absent') AS totalAbsent,

            SUM(status = 'late') AS totalLate,

            SUM(status = 'leave') AS totalLeave

        FROM attendance

        WHERE attendance_date = CURDATE()
        `
    );

    return rows[0];

};

/**
 * Recently Added Students
 */
export const getRecentStudents = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            s.id,

            u.name,

            u.email,

            s.registration_no,

            d.department_name,

            s.current_semester

        FROM students s

        INNER JOIN users u
            ON s.user_id = u.id

        INNER JOIN departments d
            ON s.department_id = d.id

        ORDER BY s.created_at DESC

        LIMIT 5
        `
    );

    return rows;

};

/**
 * Recently Added Faculty
 */
export const getRecentFaculty = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            f.id,

            u.name,

            u.email,

            d.department_name,

            f.designation

        FROM faculty f

        INNER JOIN users u
            ON f.user_id = u.id

        INNER JOIN departments d
            ON f.department_id = d.id

        ORDER BY f.created_at DESC

        LIMIT 5
        `
    );

    return rows;

};

/**
 * Fee Summary
 */
export const getFeeSummary = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            SUM(total_fee) AS totalFee,

            SUM(paid_amount) AS totalCollected,

            SUM(due_amount) AS totalDue

        FROM fees
        `
    );

    return rows[0];

};

/**
 * Recent Notices
 */
export const getRecentNotices = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            id,

            title,

            created_at

        FROM notices

        ORDER BY created_at DESC

        LIMIT 5
        `
    );

    return rows;

};





/**
 * Student Basic Profile
 */
export const getStudentProfile = async (userId) => {

    const [rows] = await db.execute(
        `
        SELECT

            s.id,
            u.name,
            u.email,
            s.registration_no,
            d.department_name,
            s.current_semester,
            s.section

        FROM students s

        INNER JOIN users u
            ON s.user_id = u.id

        INNER JOIN departments d
            ON s.department_id = d.id

        WHERE s.user_id = ?

        LIMIT 1
        `,
        [userId]
    );

    return rows[0];

};

/**
 * Student CGPA
 */
export const getStudentCGPA = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT
            ROUND(AVG(grade_point),2) AS cgpa
        FROM results r

        INNER JOIN enrollments e
            ON r.enrollment_id = e.id

        WHERE e.student_id = ?
        `,
        [studentId]
    );

    return rows[0];

};

/**
 * Overall Attendance
 */
export const getStudentAttendance = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT

            COUNT(*) AS totalClasses,

            SUM(status='present') AS totalPresent,

            ROUND(
                SUM(status='present') * 100 / COUNT(*),
                2
            ) AS attendancePercentage

        FROM attendance a

        INNER JOIN enrollments e
            ON a.enrollment_id = e.id

        WHERE e.student_id = ?
        `,
        [studentId]
    );

    return rows[0];

};

/**
 * Registered Courses Count
 */
export const getStudentRegisteredCourses = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT
            COUNT(*) AS registeredCourses
        FROM enrollments
        WHERE student_id = ?
        AND status='enrolled'
        `,
        [studentId]
    );

    return rows[0];

};

/**
 * Credits Earned
 */
export const getStudentCredits = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT

            IFNULL(SUM(c.credits),0) AS creditsEarned

        FROM enrollments e

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE e.student_id = ?

        AND e.status='completed'
        `,
        [studentId]
    );

    return rows[0];

};

/**
 * Subject Wise Attendance
 */
export const getSubjectWiseAttendance = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT

            c.title,

            ROUND(
                SUM(a.status='present') * 100 / COUNT(*),
                2
            ) AS attendance

        FROM attendance a

        INNER JOIN enrollments e
            ON a.enrollment_id = e.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE e.student_id = ?

        GROUP BY c.id,c.title

        ORDER BY c.title
        `,
        [studentId]
    );

    return rows;

};

/**
 * Upcoming Exams
 */
export const getUpcomingExams = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT

            ex.title,

            c.title AS course,

            ex.exam_date,

            ex.exam_type

        FROM exams ex

        INNER JOIN course_offerings co
            ON ex.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        INNER JOIN enrollments e
            ON e.course_offering_id = co.id

        WHERE e.student_id = ?

        AND ex.exam_date >= CURDATE()

        ORDER BY ex.exam_date

        LIMIT 5
        `,
        [studentId]
    );

    return rows;

};

/**
 * Fee Summary
 */
export const getStudentFeeSummary = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT

            SUM(total_fee) AS totalFee,

            SUM(paid_amount) AS paid,

            SUM(due_amount) AS due

        FROM fees

        WHERE student_id = ?
        `,
        [studentId]
    );

    return rows[0];

};

/**
 * Recent Activities
 */
export const getRecentActivities = async (studentId) => {

    const [rows] = await db.execute(
        `
        SELECT

            attendance_date AS activityDate,

            CONCAT(
                'Attendance marked as ',
                status
            ) AS activity

        FROM attendance a

        INNER JOIN enrollments e
            ON a.enrollment_id = e.id

        WHERE e.student_id = ?

        ORDER BY attendance_date DESC

        LIMIT 5
        `,
        [studentId]
    );

    return rows;

};

/**
 * Faculty Profile
 */
export const getFacultyProfile = async (userId) => {

    const [rows] = await db.execute(
        `
        SELECT

            f.id,

            u.name,

            u.email,

            f.employee_id,

            f.designation,

            d.department_name

        FROM faculty f

        INNER JOIN users u
            ON f.user_id = u.id

        INNER JOIN departments d
            ON f.department_id = d.id

        WHERE f.user_id = ?

        LIMIT 1
        `,
        [userId]
    );

    return rows[0];

};

/**
 * Courses Assigned To Faculty
 */
export const getFacultyCourses = async (facultyId) => {

    const [rows] = await db.execute(
        `
        SELECT

            co.id,

            c.course_code,

            c.title,

            co.semester,

            co.section,

            co.academic_year

        FROM course_offerings co

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE co.faculty_id = ?

        ORDER BY co.semester
        `,
        [facultyId]
    );

    return rows;

};

/**
 * Today's Classes
 */
export const getFacultyTodayClasses = async (facultyId) => {

    const [rows] = await db.execute(
        `
        SELECT

            c.course_code,

            c.title,

            co.section,

            co.semester

        FROM course_offerings co

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE co.faculty_id = ?
        `,
        [facultyId]
    );

    return rows;

};

/**
 * Total Students Under Faculty
 */
export const getFacultyStudentCount = async (facultyId) => {

    const [rows] = await db.execute(
        `
        SELECT

            COUNT(e.id) AS totalStudents

        FROM enrollments e

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        WHERE co.faculty_id = ?

        AND e.status = 'enrolled'
        `,
        [facultyId]
    );

    return rows[0];

};

/**
 * Pending Attendance
 * (Today's attendance not marked)
 */
export const getFacultyPendingAttendance = async (facultyId) => {

    const [rows] = await db.execute(
        `
        SELECT

            co.id,

            c.course_code,

            c.title,

            co.section,

            co.semester

        FROM course_offerings co

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE co.faculty_id = ?

        AND NOT EXISTS (

            SELECT 1

            FROM attendance a

            INNER JOIN enrollments e
                ON a.enrollment_id = e.id

            WHERE e.course_offering_id = co.id

            AND a.attendance_date = CURDATE()

        )
        `,
        [facultyId]
    );

    return rows;

};