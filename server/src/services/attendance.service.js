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

/**
 * Create Attendance
 */
export const createAttendanceService = async (data) => {

    const {

        enrollment_id,

        attendance_date,

        status,

        remarks

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

    return await createAttendance(

        enrollment_id,

        attendance_date,

        status,

        remarks

    );

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

        remarks

    } = data;

    return await updateAttendance(

        id,

        status,

        remarks

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