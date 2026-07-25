import db from "../config/db.js";

/**
 * Create Exam
 */
export const createExam = async (
    course_offering_id,
    exam_name,
    exam_type,
    exam_date,
    total_marks
) => {

    const [result] = await db.execute(
        `
        INSERT INTO exams
        (
            course_offering_id,
            exam_name,
            exam_type,
            exam_date,
            total_marks
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            course_offering_id,
            exam_name,
            exam_type,
            exam_date,
            total_marks
        ]
    );

    return result;

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
 * Check Duplicate Exam
 */
export const findExam = async (
    course_offering_id,
    exam_name,
    exam_type
) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM exams
        WHERE
            course_offering_id = ?
        AND
            exam_name = ?
        AND
            exam_type = ?
        LIMIT 1
        `,
        [
            course_offering_id,
            exam_name,
            exam_type
        ]
    );

    return rows;

};

/**
 * Get All Exams
 */
export const getAllExams = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            e.id,

            c.course_name,

            co.academic_year,

            co.semester,

            co.section,

            e.exam_name,

            e.exam_type,

            e.exam_date,

            e.total_marks,

            e.created_at

        FROM exams e

        INNER JOIN course_offerings co
            ON e.course_offering_id = co.id

        INNER JOIN courses c
            ON co.course_id = c.id

        ORDER BY
            e.exam_date DESC
        `
    );

    return rows;

};

/**
 * Get Exam By ID
 */
export const getExamById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT *

        FROM exams

        WHERE id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;

};

/**
 * Get Exams By Course Offering
 */
export const getExamsByCourseOffering = async (
    course_offering_id
) => {

    const [rows] = await db.execute(
        `
        SELECT

            id,

            exam_name,

            exam_type,

            exam_date,

            total_marks

        FROM exams

        WHERE course_offering_id = ?

        ORDER BY exam_date ASC
        `,
        [course_offering_id]
    );

    return rows;

};

/**
 * Update Exam
 */
export const updateExam = async (
    id,
    exam_name,
    exam_type,
    exam_date,
    total_marks
) => {

    const [result] = await db.execute(
        `
        UPDATE exams

        SET

            exam_name = ?,

            exam_type = ?,

            exam_date = ?,

            total_marks = ?

        WHERE id = ?
        `,
        [
            exam_name,
            exam_type,
            exam_date,
            total_marks,
            id
        ]
    );

    return result;

};

/**
 * Delete Exam
 */
export const deleteExam = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM exams

        WHERE id = ?
        `,
        [id]
    );

    return result;

};