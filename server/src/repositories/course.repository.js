import db from "../config/db.js";

/**
 * Create Course
 */
export const createCourse = async (
    department_id,
    course_code,
    course_name,
    course_type,
    credits,
    semester,
    description
) => {

    const [result] = await db.execute(
        `
        INSERT INTO courses
        (
            department_id,
            course_code,
            course_name,
            course_type,
            credits,
            semester,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            department_id,
            course_code,
            course_name,
            course_type,
            credits,
            semester,
            description
        ]
    );

    return result;
};

/**
 * Find Course By Code
 */
export const findCourseByCode = async (course_code) => {

    const [rows] = await db.execute(
        `
        SELECT *
        FROM courses
        WHERE course_code = ?
        LIMIT 1
        `,
        [course_code]
    );

    return rows;
};

/**
 * Check Department Exists
 */
export const findDepartmentById = async (department_id) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM departments
        WHERE id = ?
        AND status = 'active'
        LIMIT 1
        `,
        [department_id]
    );

    return rows;
};

/**
 * Get All Courses
 */
export const getAllCourses = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            c.id,

            c.course_code,

            c.course_name,

            c.course_type,

            c.credits,

            c.semester,

            d.department_name,

            d.department_code,

            c.status,

            c.created_at

        FROM courses c

        INNER JOIN departments d
        ON c.department_id = d.id

        WHERE c.status = 'active'

        ORDER BY c.semester ASC,
                 c.course_code ASC
        `
    );

    return rows;
};

/**
 * Get Course By ID
 */
export const getCourseById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT

            c.id,

            c.department_id,

            c.course_code,

            c.course_name,

            c.course_type,

            c.credits,

            c.semester,

            c.description,

            c.status,

            c.created_at,

            c.updated_at,

            d.department_name,

            d.department_code

        FROM courses c

        INNER JOIN departments d
        ON c.department_id = d.id

        WHERE c.id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;
};

/**
 * Update Course
 */
export const updateCourse = async (
    id,
    department_id,
    course_name,
    course_type,
    credits,
    semester,
    description
) => {

    const [result] = await db.execute(
        `
        UPDATE courses
        SET
            department_id = ?,
            course_name = ?,
            course_type = ?,
            credits = ?,
            semester = ?,
            description = ?
        WHERE id = ?
        `,
        [
            department_id,
            course_name,
            course_type,
            credits,
            semester,
            description,
            id
        ]
    );

    return result;
};

/**
 * Soft Delete Course
 */
export const deleteCourse = async (id) => {

    const [result] = await db.execute(
        `
        UPDATE courses
        SET status = 'inactive'
        WHERE id = ?
        `,
        [id]
    );

    return result;
};