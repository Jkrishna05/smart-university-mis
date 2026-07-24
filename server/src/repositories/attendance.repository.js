import db from "../config/db.js";

/**
 * Create Attendance
 */
export const createAttendance = async (
    enrollment_id,
    attendance_date,
    status,
    remarks
) => {

    const [result] = await db.execute(
        `
        INSERT INTO attendance
        (
            enrollment_id,
            attendance_date,
            status,
            remarks
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            enrollment_id,
            attendance_date,
            status,
            remarks
        ]
    );

    return result;

};

/**
 * Check Enrollment Exists
 */
export const findEnrollmentById = async (enrollment_id) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM enrollments
        WHERE id = ?
        LIMIT 1
        `,
        [enrollment_id]
    );

    return rows;

};

/**
 * Check Duplicate Attendance
 */
export const findAttendance = async (
    enrollment_id,
    attendance_date
) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM attendance
        WHERE enrollment_id = ?
        AND attendance_date = ?
        LIMIT 1
        `,
        [
            enrollment_id,
            attendance_date
        ]
    );

    return rows;

};

/**
 * Get All Attendance
 */
export const getAllAttendance = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            a.id,

            s.registration_no,

            u.name,

            c.course_name,

            co.section,

            a.attendance_date,

            a.status,

            a.remarks

        FROM attendance a

        INNER JOIN enrollments e
            ON a.enrollment_id = e.id

        INNER JOIN students s
            ON e.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        ORDER BY
            a.attendance_date DESC,
            u.name ASC
        `
    );

    return rows;

};

/**
 * Get Attendance By ID
 */
export const getAttendanceById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT *
        FROM attendance
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows;

};

/**
 * Get Attendance By Student
 */
export const getAttendanceByStudent = async (student_id) => {

    const [rows] = await db.execute(
        `
        SELECT

            a.id,

            c.course_name,

            co.section,

            a.attendance_date,

            a.status,

            a.remarks

        FROM attendance a

        INNER JOIN enrollments e
            ON a.enrollment_id = e.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE e.student_id = ?

        ORDER BY a.attendance_date DESC
        `,
        [student_id]
    );

    return rows;

};

/**
 * Get Attendance By Course Offering
 */
export const getAttendanceByCourseOffering = async (
    course_offering_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            a.id,

            s.registration_no,

            u.name,

            a.attendance_date,

            a.status,

            a.remarks

        FROM attendance a

        INNER JOIN enrollments e
            ON a.enrollment_id = e.id

        INNER JOIN students s
            ON e.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        WHERE e.course_offering_id = ?

        ORDER BY
            a.attendance_date DESC,
            u.name ASC
        `,
        [course_offering_id]
    );

    return rows;

};

/**
 * Get Attendance By Date
 */
export const getAttendanceByDate = async (
    course_offering_id,
    attendance_date
) => {

    const [rows] = await db.execute(
        `
        SELECT

            a.id,

            s.registration_no,

            u.name,

            a.status,

            a.remarks

        FROM attendance a

        INNER JOIN enrollments e
            ON a.enrollment_id = e.id

        INNER JOIN students s
            ON e.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        WHERE
            e.course_offering_id = ?
        AND
            a.attendance_date = ?

        ORDER BY u.name
        `,
        [
            course_offering_id,
            attendance_date
        ]
    );

    return rows;

};

/**
 * Update Attendance
 */
export const updateAttendance = async (
    id,
    status,
    remarks
) => {

    const [result] = await db.execute(
        `
        UPDATE attendance
        SET

            status = ?,

            remarks = ?

        WHERE id = ?
        `,
        [
            status,
            remarks,
            id
        ]
    );

    return result;

};

/**
 * Delete Attendance
 */
export const deleteAttendance = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM attendance
        WHERE id = ?
        `,
        [id]
    );

    return result;

};

/**
 * Attendance Summary
 */
export const getAttendanceSummary = async (
    enrollment_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            COUNT(*) AS total_classes,

            SUM(status='present') AS total_present,

            SUM(status='absent') AS total_absent,

            SUM(status='late') AS total_late,

            SUM(status='leave') AS total_leave

        FROM attendance

        WHERE enrollment_id = ?
        `,
        [enrollment_id]
    );

    return rows;

};