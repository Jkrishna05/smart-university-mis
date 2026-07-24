import db from "../config/db.js";

/**
 * Create Enrollment
 */
export const createEnrollment = async (
    student_id,
    course_offering_id,
    enrollment_date
) => {

    const [result] = await db.execute(
        `
        INSERT INTO enrollments
        (
            student_id,
            course_offering_id,
            enrollment_date
        )
        VALUES (?, ?, ?)
        `,
        [
            student_id,
            course_offering_id,
            enrollment_date
        ]
    );

    return result;
};

/**
 * Check Student Exists
 */
export const findStudentById = async (student_id) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM students
        WHERE id = ?
        AND status = 'active'
        LIMIT 1
        `,
        [student_id]
    );

    return rows;
};

/**
 * Check Course Offering Exists
 */
export const findCourseOfferingById = async (
    course_offering_id
) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM course_offerings
        WHERE id = ?
        LIMIT 1
        `,
        [course_offering_id]
    );

    return rows;
};

/**
 * Check Already Enrolled
 */
export const findEnrollment = async (
    student_id,
    course_offering_id
) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM enrollments
        WHERE student_id = ?
        AND course_offering_id = ?
        LIMIT 1
        `,
        [
            student_id,
            course_offering_id
        ]
    );

    return rows;
};

/**
 * Get All Enrollments
 */
export const getAllEnrollments = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            e.id,

            u.name,

            s.registration_no,

            c.course_code,

            c.course_name,

            co.section,

            co.academic_year,

            e.enrollment_date,

            e.status

        FROM enrollments e

        INNER JOIN students s
            ON e.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        ORDER BY
            e.created_at DESC
        `
    );

    return rows;
};

/**
 * Get Enrollment By ID
 */
export const getEnrollmentById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT

            e.*,

            u.name,

            u.email,

            s.registration_no,

            c.course_code,

            c.course_name,

            co.section,

            co.academic_year

        FROM enrollments e

        INNER JOIN students s
            ON e.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE e.id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;
};

/**
 * Get Student Enrollments
 */
export const getEnrollmentsByStudent = async (
    student_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            c.course_code,

            c.course_name,

            c.credits,

            co.section,

            co.academic_year,

            e.status

        FROM enrollments e

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE e.student_id = ?

        ORDER BY c.course_name
        `,
        [student_id]
    );

    return rows;
};

/**
 * Get Students By Course Offering
 */
export const getStudentsByCourseOffering = async (
    course_offering_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            s.id,

            s.registration_no,

            u.name,

            u.email,

            s.current_semester,

            s.section

        FROM enrollments e

        INNER JOIN students s
            ON e.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        WHERE e.course_offering_id = ?
        AND e.status = 'enrolled'

        ORDER BY u.name
        `,
        [course_offering_id]
    );

    return rows;
};

/**
 * Update Enrollment Status
 */
export const updateEnrollment = async (
    id,
    status
) => {

    const [result] = await db.execute(
        `
        UPDATE enrollments
        SET
            status = ?
        WHERE id = ?
        `,
        [
            status,
            id
        ]
    );

    return result;
};

/**
 * Delete Enrollment
 */
export const deleteEnrollment = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM enrollments
        WHERE id = ?
        `,
        [id]
    );

    return result;
};