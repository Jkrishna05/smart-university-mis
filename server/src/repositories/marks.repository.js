import db from "../config/db.js";

/**
 * Create Marks
 */
export const createMarks = async (
    enrollment_id,
    exam_id,
    marks_obtained
) => {

    const [result] = await db.execute(
        `
        INSERT INTO marks
        (
            enrollment_id,
            exam_id,
            marks_obtained
        )
        VALUES (?, ?, ?)
        `,
        [
            enrollment_id,
            exam_id,
            marks_obtained
        ]
    );

    return result;

};

/**
 * Check Enrollment Exists
 */
export const findEnrollmentById = async (
    enrollment_id
) => {

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
 * Check Exam Exists
 */
export const findExamById = async (
    exam_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            id,

            total_marks

        FROM exams

        WHERE id = ?

        LIMIT 1
        `,
        [exam_id]
    );

    return rows;

};

/**
 * Check Duplicate Marks
 */
export const findMarks = async (
    enrollment_id,
    exam_id
) => {

    const [rows] = await db.execute(
        `
        SELECT id

        FROM marks

        WHERE

            enrollment_id = ?

        AND

            exam_id = ?

        LIMIT 1
        `,
        [
            enrollment_id,
            exam_id
        ]
    );

    return rows;

};

/**
 * Get All Marks
 */
export const getAllMarks = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            m.id,

            s.registration_no,

            u.name,

            c.course_name,

            e.exam_name,

            e.exam_type,

            e.total_marks,

            m.marks_obtained,

            m.created_at

        FROM marks m

        INNER JOIN enrollments en
            ON m.enrollment_id = en.id

        INNER JOIN students s
            ON en.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        INNER JOIN exams e
            ON m.exam_id = e.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        ORDER BY
            u.name ASC
        `
    );

    return rows;

};

/**
 * Get Marks By ID
 */
export const getMarksById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT *

        FROM marks

        WHERE id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;

};

/**
 * Get Marks By Student
 */
export const getMarksByStudent = async (
    student_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            c.course_name,

            e.exam_name,

            e.exam_type,

            e.total_marks,

            m.marks_obtained

        FROM marks m

        INNER JOIN enrollments en
            ON m.enrollment_id = en.id

        INNER JOIN exams e
            ON m.exam_id = e.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE en.student_id = ?

        ORDER BY
            c.course_name,
            e.exam_date
        `,
        [student_id]
    );

    return rows;

};

/**
 * Get Marks By Exam
 */
export const getMarksByExam = async (
    exam_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            s.registration_no,

            u.name,

            m.marks_obtained

        FROM marks m

        INNER JOIN enrollments en
            ON m.enrollment_id = en.id

        INNER JOIN students s
            ON en.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        WHERE m.exam_id = ?

        ORDER BY
            u.name
        `,
        [exam_id]
    );

    return rows;

};

/**
 * Get Marks By Course Offering
 */
export const getMarksByCourseOffering = async (
    course_offering_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            s.registration_no,

            u.name,

            e.exam_name,

            m.marks_obtained

        FROM marks m

        INNER JOIN enrollments en
            ON m.enrollment_id = en.id

        INNER JOIN students s
            ON en.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        INNER JOIN exams e
            ON m.exam_id = e.id

        WHERE e.course_offering_id = ?

        ORDER BY
            u.name,
            e.exam_name
        `,
        [course_offering_id]
    );

    return rows;

};

/**
 * Update Marks
 */
export const updateMarks = async (
    id,
    marks_obtained
) => {

    const [result] = await db.execute(
        `
        UPDATE marks

        SET

            marks_obtained = ?

        WHERE id = ?
        `,
        [
            marks_obtained,
            id
        ]
    );

    return result;

};

/**
 * Delete Marks
 */
export const deleteMarks = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM marks

        WHERE id = ?
        `,
        [id]
    );

    return result;

};

/**
 * Student Result Summary
 */
export const getStudentResultSummary = async (
    student_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            c.course_name,

            SUM(m.marks_obtained) AS obtained_marks,

            SUM(e.total_marks) AS total_marks,

            c.credits

        FROM marks m

        INNER JOIN enrollments en
            ON m.enrollment_id = en.id

        INNER JOIN exams e
            ON m.exam_id = e.id

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        WHERE en.student_id = ?

        GROUP BY
            c.id,
            c.course_name,
            c.credits

        ORDER BY
            c.course_name
        `
    );

    return rows;

};