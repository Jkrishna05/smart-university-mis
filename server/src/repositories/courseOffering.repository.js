import db from "../config/db.js";

/**
 * Create Course Offering
 */
export const createCourseOffering = async (
    course_id,
    faculty_id,
    academic_year,
    semester,
    section,
    max_students
) => {

    const [result] = await db.execute(
        `
        INSERT INTO course_offerings
        (
            course_id,
            faculty_id,
            academic_year,
            semester,
            section,
            max_students
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            course_id,
            faculty_id,
            academic_year,
            semester,
            section,
            max_students
        ]
    );

    return result;
};

/**
 * Check Course Exists
 */
export const findCourseById = async (course_id) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM courses
        WHERE id = ?
        LIMIT 1
        `,
        [course_id]
    );

    return rows;
};

/**
 * Check Faculty Exists
 */
export const findFacultyById = async (faculty_id) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM faculty
        WHERE id = ?
        AND status = 'active'
        LIMIT 1
        `,
        [faculty_id]
    );

    return rows;
};

/**
 * Check Duplicate Course Offering
 */
export const findCourseOffering = async (
    course_id,
    faculty_id,
    academic_year,
    semester,
    section
) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM course_offerings
        WHERE
            course_id = ?
            AND faculty_id = ?
            AND academic_year = ?
            AND semester = ?
            AND section = ?
        LIMIT 1
        `,
        [
            course_id,
            faculty_id,
            academic_year,
            semester,
            section
        ]
    );

    return rows;
};

/**
 * Get All Course Offerings
 */
export const getAllCourseOfferings = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            co.id,

            c.course_code,

            c.course_name,

            u.name AS faculty_name,

            co.academic_year,

            co.semester,

            co.section,

            co.max_students,

            co.created_at

        FROM course_offerings co

        INNER JOIN courses c
            ON co.course_id = c.id

        INNER JOIN faculty f
            ON co.faculty_id = f.id

        INNER JOIN users u
            ON f.user_id = u.id

        ORDER BY
            co.academic_year DESC,
            co.semester ASC,
            c.course_name ASC
        `
    );

    return rows;
};

/**
 * Get Course Offering By ID
 */
export const getCourseOfferingById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT

            co.*,

            c.course_code,

            c.course_name,

            u.name AS faculty_name,

            u.email

        FROM course_offerings co

        INNER JOIN courses c
            ON co.course_id = c.id

        INNER JOIN faculty f
            ON co.faculty_id = f.id

        INNER JOIN users u
            ON f.user_id = u.id

        WHERE co.id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;
};

/**
 * Get Course Offerings By Faculty
 */
export const getCourseOfferingsByFaculty = async (
    faculty_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            co.id,

            c.course_code,

            c.course_name,

            co.academic_year,

            co.semester,

            co.section,

            co.max_students

        FROM course_offerings co

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE co.faculty_id = ?

        ORDER BY
            co.semester,
            c.course_name
        `,
        [faculty_id]
    );

    return rows;
};

/**
 * Get Course Offerings By Semester
 */
export const getCourseOfferingsBySemester = async (
    semester
) => {

    const [rows] = await db.execute(
        `
        SELECT

            co.id,

            c.course_code,

            c.course_name,

            u.name AS faculty_name,

            co.section,

            co.academic_year

        FROM course_offerings co

        INNER JOIN courses c
            ON co.course_id = c.id

        INNER JOIN faculty f
            ON co.faculty_id = f.id

        INNER JOIN users u
            ON f.user_id = u.id

        WHERE co.semester = ?

        ORDER BY c.course_name
        `,
        [semester]
    );

    return rows;
};

/**
 * Update Course Offering
 */
export const updateCourseOffering = async (
    id,
    faculty_id,
    section,
    max_students
) => {

    const [result] = await db.execute(
        `
        UPDATE course_offerings
        SET
            faculty_id = ?,
            section = ?,
            max_students = ?
        WHERE id = ?
        `,
        [
            faculty_id,
            section,
            max_students,
            id
        ]
    );

    return result;
};

/**
 * Delete Course Offering
 */
export const deleteCourseOffering = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM course_offerings
        WHERE id = ?
        `,
        [id]
    );

    return result;
};