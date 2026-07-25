import db from "../config/db.js";

/**
 * Check Student Exists
 */
export const findStudentById = async (student_id) => {

    const [rows] = await db.execute(
        `
        SELECT
            id
        FROM students
        WHERE id = ?
        LIMIT 1
        `,
        [student_id]
    );

    return rows;
};

/**
 * Check Duplicate Fee
 */
export const checkDuplicateFee = async (
    student_id,
    fee_type,
    semester,
    academic_year
) => {

    const [rows] = await db.execute(
        `
        SELECT
            id
        FROM fees
        WHERE
            student_id = ?
            AND fee_type = ?
            AND semester = ?
            AND academic_year = ?
        LIMIT 1
        `,
        [
            student_id,
            fee_type,
            semester,
            academic_year
        ]
    );

    return rows;
};

/**
 * Create Fee
 */
export const createFee = async (
    student_id,
    fee_type,
    semester,
    academic_year,
    total_amount,
    amount_paid,
    payment_status,
    due_date
) => {

    const [result] = await db.execute(
        `
        INSERT INTO fees
        (
            student_id,
            fee_type,
            semester,
            academic_year,
            total_amount,
            amount_paid,
            payment_status,
            due_date
        )
        VALUES
        (
            ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
        [
            student_id,
            fee_type,
            semester,
            academic_year,
            total_amount,
            amount_paid,
            payment_status,
            due_date
        ]
    );

    return result;
};

/**
 * Get All Fees
 */
export const getAllFees = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            f.id,

            s.registration_no,

            u.name,

            f.fee_type,

            f.semester,

            f.academic_year,

            f.total_amount,

            f.amount_paid,

            (f.total_amount - f.amount_paid) AS due_amount,

            f.payment_status,

            f.due_date,

            f.created_at

        FROM fees f

        INNER JOIN students s
            ON f.student_id = s.id

        INNER JOIN users u
            ON s.user_id = u.id

        ORDER BY f.created_at DESC
        `
    );

    return rows;
};

/**
 * Get Fee By Id
 */
export const getFeeById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT
            *
        FROM fees
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows;
};

/**
 * Get Fees By Student
 */
export const getFeesByStudentId = async (student_id) => {

    const [rows] = await db.execute(
        `
        SELECT

            id,

            fee_type,

            semester,

            academic_year,

            total_amount,

            amount_paid,

            (total_amount - amount_paid) AS due_amount,

            payment_status,

            due_date

        FROM fees

        WHERE student_id = ?

        ORDER BY semester
        `,
        [student_id]
    );

    return rows;
};

/**
 * Update Fee
 */
export const updateFee = async (
    id,
    fee_type,
    semester,
    academic_year,
    total_amount,
    amount_paid,
    payment_status,
    due_date
) => {

    const [result] = await db.execute(
        `
        UPDATE fees

        SET

            fee_type = ?,

            semester = ?,

            academic_year = ?,

            total_amount = ?,

            amount_paid = ?,

            payment_status = ?,

            due_date = ?

        WHERE id = ?
        `,
        [
            fee_type,
            semester,
            academic_year,
            total_amount,
            amount_paid,
            payment_status,
            due_date,
            id
        ]
    );

    return result;
};

/**
 * Update Payment
 */
export const updatePayment = async (
    id,
    amount_paid,
    payment_status
) => {

    const [result] = await db.execute(
        `
        UPDATE fees

        SET

            amount_paid = ?,

            payment_status = ?

        WHERE id = ?
        `,
        [
            amount_paid,
            payment_status,
            id
        ]
    );

    return result;
};

/**
 * Delete Fee
 */
export const deleteFee = async (id) => {

    const [result] = await db.execute(
        `
        DELETE FROM fees
        WHERE id = ?
        `,
        [id]
    );

    return result;
};