import db from "../config/db.js";
import {

    createAttendance,

    findEnrollmentById,

    findAttendance,

    getAllAttendance,

    getAttendanceById,

    getAttendanceByStudent,

    getAttendanceByCourseOffering,

    getAttendanceByDate,

    updateAttendance,

    deleteAttendance,

    getAttendanceSummary

} from "../repositories/attendance.repository.js";
import { createNotificationService } from "./notification.service.js";

const notifyLowAttendance = async (enrollmentId) => {
    try {
        const [studentRows] = await db.execute(
            `
            SELECT s.user_id AS studentUserId
            FROM enrollments e
            INNER JOIN students s ON e.student_id = s.id
            WHERE e.id = ?
            LIMIT 1
            `,
            [enrollmentId]
        );

        const studentUserId = studentRows[0]?.studentUserId;

        if (!studentUserId) {
            return;
        }

        const [summaryRows] = await db.execute(
            `
            SELECT
                COUNT(*) AS totalRecords,
                SUM(status = 'present') AS totalPresent
            FROM attendance
            WHERE enrollment_id = ?
            `,
            [enrollmentId]
        );

        const totalRecords = Number(summaryRows[0]?.totalRecords || 0);
        const totalPresent = Number(summaryRows[0]?.totalPresent || 0);
        const percentage = totalRecords > 0
            ? Number(((totalPresent / totalRecords) * 100).toFixed(2))
            : 0;

        if (percentage < 75) {
            await createNotificationService({
                title: "Attendance warning",
                message: `Your attendance is ${percentage}% this term. Please attend classes regularly.`,
                notification_type: "attendance",
                target_role: "student",
                target_user_id: studentUserId,
                source_module: "attendance"
            });
        }
    } catch (error) {
        console.error("Failed to create attendance notification", error);
    }
};

/**
 * Create Attendance
 */
export const createAttendanceService = async (data) => {

    const {

        enrollment_id,

        attendance_date,

        status,


    } = data;

    // Check Enrollment
    const enrollment = await findEnrollmentById(
        enrollment_id
    );

    if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
    }

    // Check Duplicate Attendance
    const attendance = await findAttendance(

        enrollment_id,

        attendance_date

    );

    if (attendance.length > 0) {
        throw new Error(
            "Attendance already marked for this date."
        );
    }

    const result = await createAttendance(

        enrollment_id,

        attendance_date,

        status,


    );

    await notifyLowAttendance(enrollment_id);

    return result;

};

/**
 * Get All Attendance
 */
export const getAllAttendanceService = async () => {

    return await getAllAttendance();

};

/**
 * Get Attendance By ID
 */
export const getAttendanceByIdService = async (id) => {

    const attendance = await getAttendanceById(id);

    if (attendance.length === 0) {
        throw new Error("Attendance not found");
    }

    return attendance[0];

};

/**
 * Get Attendance By Student
 */
export const getAttendanceByStudentService = async (
    student_id
) => {

    return await getAttendanceByStudent(
        student_id
    );

};

/**
 * Get Attendance By Course Offering
 */
export const getAttendanceByCourseOfferingService = async (
    course_offering_id
) => {

    return await getAttendanceByCourseOffering(
        course_offering_id
    );

};

/**
 * Get Attendance By Date
 */
export const getAttendanceByDateService = async (

    course_offering_id,

    attendance_date

) => {

    return await getAttendanceByDate(

        course_offering_id,

        attendance_date

    );

};

/**
 * Update Attendance
 */
export const updateAttendanceService = async (

    id,

    data

) => {

    const attendance = await getAttendanceById(id);

    if (attendance.length === 0) {
        throw new Error("Attendance not found");
    }

    const {

        status,

    

    } = data;

    return await updateAttendance(

        id,

        status,


    );

};

/**
 * Delete Attendance
 */
export const deleteAttendanceService = async (id) => {

    const attendance = await getAttendanceById(id);

    if (attendance.length === 0) {
        throw new Error("Attendance not found");
    }

    return await deleteAttendance(id);

};

/**
 * Attendance Summary
 */
export const getAttendanceSummaryService = async (
    enrollment_id
) => {

    const enrollment = await findEnrollmentById(
        enrollment_id
    );

    if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
    }

    const summary = await getAttendanceSummary(
        enrollment_id
    );

    return summary[0];

};