import db from "../config/db.js";
import {

    findStudentById,

    checkDuplicateFee,

    createFee,

    getAllFees,

    getFeeById,

    getFeesByStudentId,

    updateFee,

    updatePayment,

    deleteFee

} from "../repositories/fees.repository.js";
import { createNotificationService } from "./notification.service.js";

const notifyFeeDueDate = async (studentId, feeType, totalAmount, dueDate) => {
    try {
        if (!dueDate) {
            return;
        }

        const [studentRows] = await db.execute(
            `
            SELECT u.id AS userId
            FROM students s
            INNER JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
            LIMIT 1
            `,
            [studentId]
        );

        const userId = studentRows[0]?.userId;

        if (!userId) {
            return;
        }

        const dueLabel = new Date(dueDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        await createNotificationService({
            title: "Fee due reminder",
            message: `${feeType} fee of ₹${Number(totalAmount).toLocaleString("en-IN")} is due on ${dueLabel}.`,
            notification_type: "fee",
            target_role: "student",
            target_user_id: userId,
            source_module: "fees"
        });
    } catch (error) {
        console.error("Failed to create fee notification", error);
    }
};

/**
 * Create Fee
 */
export const createFeeService = async (data) => {

    const {

        student_id,

        fee_type,

        semester,

        academic_year,

        total_amount,

        amount_paid = 0,

        due_date

    } = data;

    const student = await findStudentById(student_id);

    if (student.length === 0) {

        throw new Error("Student not found.");

    }

    const duplicate = await checkDuplicateFee(

        student_id,

        fee_type,

        semester,

        academic_year

    );

    if (duplicate.length > 0) {

        throw new Error("Fee record already exists.");

    }

    let payment_status = "pending";

    if (amount_paid > 0 && amount_paid < total_amount) {

        payment_status = "partial";

    }

    if (amount_paid >= total_amount) {

        payment_status = "paid";

    }

    const result = await createFee(

        student_id,

        fee_type,

        semester,

        academic_year,

        total_amount,

        amount_paid,

        payment_status,

        due_date

    );

    await notifyFeeDueDate(student_id, fee_type, total_amount, due_date);

    return result;

};


/**
 * Get All Fees
 */
export const getAllFeesService = async () => {

    return await getAllFees();

};


/**
 * Get Fee By Id
 */
export const getFeeByIdService = async (id) => {

    const fee = await getFeeById(id);

    if (fee.length === 0) {

        throw new Error("Fee record not found.");

    }

    return fee[0];

};


/**
 * Get Student Fees
 */
export const getFeesByStudentIdService = async (student_id) => {

    return await getFeesByStudentId(student_id);

};


/**
 * Update Fee
 */
export const updateFeeService = async (id, data) => {

    const fee = await getFeeById(id);

    if (fee.length === 0) {

        throw new Error("Fee record not found.");

    }

    const {

        fee_type,

        semester,

        academic_year,

        total_amount,

        amount_paid,

        due_date

    } = data;

    let payment_status = "pending";

    if (amount_paid > 0 && amount_paid < total_amount) {

        payment_status = "partial";

    }

    if (amount_paid >= total_amount) {

        payment_status = "paid";

    }

    const result = await updateFee(

        id,

        fee_type,

        semester,

        academic_year,

        total_amount,

        amount_paid,

        payment_status,

        due_date

    );

    await notifyFeeDueDate(fee[0].student_id, fee_type, total_amount, due_date);

    return result;

};


/**
 * Update Payment
 */
export const updatePaymentService = async (id, paymentAmount) => {

    const fee = await getFeeById(id);

    if (fee.length === 0) {

        throw new Error("Fee record not found.");

    }

    const currentFee = fee[0];

    const newAmountPaid =
        Number(currentFee.amount_paid) + Number(paymentAmount);

    let paymentStatus = "pending";

    if (
        newAmountPaid > 0 &&
        newAmountPaid < currentFee.total_amount
    ) {

        paymentStatus = "partial";

    }

    if (
        newAmountPaid >= currentFee.total_amount
    ) {

        paymentStatus = "paid";

    }

    return await updatePayment(

        id,

        newAmountPaid,

        paymentStatus

    );

};


/**
 * Delete Fee
 */
export const deleteFeeService = async (id) => {

    const fee = await getFeeById(id);

    if (fee.length === 0) {

        throw new Error("Fee record not found.");

    }

    return await deleteFee(id);

};