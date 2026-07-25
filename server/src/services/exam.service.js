import {

    createExam,

    findCourseOfferingById,

    findExam,

    getAllExams,

    getExamById,

    getExamsByCourseOffering,

    updateExam,

    deleteExam

} from "../repositories/exam.repository.js";

/**
 * Create Exam
 */
export const createExamService = async (data) => {

    const {

        course_offering_id,

        exam_name,

        exam_type,

        exam_date,

        total_marks

    } = data;

    // Check Course Offering
    const courseOffering = await findCourseOfferingById(
        course_offering_id
    );

    if (courseOffering.length === 0) {
        throw new Error("Course Offering not found.");
    }

    // Check Duplicate Exam
    const exam = await findExam(

        course_offering_id,

        exam_name,

        exam_type

    );

    if (exam.length > 0) {
        throw new Error("Exam already exists.");
    }

    return await createExam(

        course_offering_id,

        exam_name,

        exam_type,

        exam_date,

        total_marks

    );

};

/**
 * Get All Exams
 */
export const getAllExamsService = async () => {

    return await getAllExams();

};

/**
 * Get Exam By ID
 */
export const getExamByIdService = async (id) => {

    const exam = await getExamById(id);

    if (exam.length === 0) {
        throw new Error("Exam not found.");
    }

    return exam[0];

};

/**
 * Get Exams By Course Offering
 */
export const getExamsByCourseOfferingService = async (
    course_offering_id
) => {

    return await getExamsByCourseOffering(
        course_offering_id
    );

};

/**
 * Update Exam
 */
export const updateExamService = async (
    id,
    data
) => {

    const exam = await getExamById(id);

    if (exam.length === 0) {
        throw new Error("Exam not found.");
    }

    const {

        exam_name,

        exam_type,

        exam_date,

        total_marks

    } = data;

    return await updateExam(

        id,

        exam_name,

        exam_type,

        exam_date,

        total_marks

    );

};

/**
 * Delete Exam
 */
export const deleteExamService = async (id) => {

    const exam = await getExamById(id);

    if (exam.length === 0) {
        throw new Error("Exam not found.");
    }

    return await deleteExam(id);

};