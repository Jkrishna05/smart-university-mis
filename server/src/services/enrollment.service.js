import {

    createEnrollment,

    findStudentById,

    findCourseOfferingById,

    findEnrollment,

    getAllEnrollments,

    getEnrollmentById,

    getEnrollmentsByStudent,

    getStudentsByCourseOffering,

    updateEnrollment,

    deleteEnrollment

} from "../repositories/enrollment.repository.js";

/**
 * Create Enrollment
 */
export const createEnrollmentService = async (data) => {

    const {

        student_id,

        course_offering_id,

        enrollment_date

    } = data;

    // Check Student
    const student = await findStudentById(student_id);

    if (student.length === 0) {
        throw new Error("Student not found");
    }

    // Check Course Offering
    const courseOffering =
        await findCourseOfferingById(course_offering_id);

    if (courseOffering.length === 0) {
        throw new Error("Course offering not found");
    }

    // Already Enrolled
    const alreadyEnrolled =
        await findEnrollment(
            student_id,
            course_offering_id
        );

    if (alreadyEnrolled.length > 0) {
        throw new Error("Student is already enrolled in this course");
    }

    const result = await createEnrollment(

        student_id,

        course_offering_id,

        enrollment_date

    );

    return result;

};

/**
 * Get All Enrollments
 */
export const getAllEnrollmentsService = async () => {

    return await getAllEnrollments();

};

/**
 * Get Enrollment By ID
 */
export const getEnrollmentByIdService = async (id) => {

    const enrollment =
        await getEnrollmentById(id);

    if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
    }

    return enrollment[0];

};

/**
 * Get Student Enrollments
 */
export const getStudentEnrollmentsService = async (
    student_id
) => {

    return await getEnrollmentsByStudent(student_id);

};

/**
 * Get Students By Course Offering
 */
export const getStudentsByCourseOfferingService = async (
    course_offering_id
) => {

    return await getStudentsByCourseOffering(
        course_offering_id
    );

};

/**
 * Update Enrollment Status
 */
export const updateEnrollmentService = async (
    id,
    status
) => {

    const enrollment =
        await getEnrollmentById(id);

    if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
    }

    return await updateEnrollment(
        id,
        status
    );

};

/**
 * Delete Enrollment
 */
export const deleteEnrollmentService = async (id) => {

    const enrollment =
        await getEnrollmentById(id);

    if (enrollment.length === 0) {
        throw new Error("Enrollment not found");
    }

    return await deleteEnrollment(id);

};