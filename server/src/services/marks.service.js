import {

    createMarks,

    findEnrollmentById,

    findExamById,

    findMarks,

    getAllMarks,

    getMarksById,

    getMarksByStudent,

    getMarksByExam,

    getMarksByCourseOffering,

    updateMarks,

    deleteMarks,

    getStudentResultSummary

} from "../repositories/marks.repository.js";

/**
 * Create Marks
 */
export const createMarksService = async (data) => {

    const {

        enrollment_id,

        exam_id,

        marks_obtained

    } = data;

    const enrollment = await findEnrollmentById(
        enrollment_id
    );

    if (enrollment.length === 0) {
        throw new Error("Enrollment not found.");
    }

    const exam = await findExamById(
        exam_id
    );

    if (exam.length === 0) {
        throw new Error("Exam not found.");
    }

    if (Number(marks_obtained) > Number(exam[0].total_marks)) {
        throw new Error(
            `Marks cannot be greater than ${exam[0].total_marks}.`
        );
    }

    const marks = await findMarks(
        enrollment_id,
        exam_id
    );

    if (marks.length > 0) {
        throw new Error("Marks already entered.");
    }

    return await createMarks(

        enrollment_id,

        exam_id,

        marks_obtained

    );

};

/**
 * Get All Marks
 */
export const getAllMarksService = async () => {

    return await getAllMarks();

};

/**
 * Get Marks By ID
 */
export const getMarksByIdService = async (id) => {

    const mark = await getMarksById(id);

    if (mark.length === 0) {
        throw new Error("Marks not found.");
    }

    return mark[0];

};

/**
 * Get Marks By Student
 */
export const getMarksByStudentService = async (
    student_id
) => {

    return await getMarksByStudent(
        student_id
    );

};

/**
 * Get Marks By Exam
 */
export const getMarksByExamService = async (
    exam_id
) => {

    return await getMarksByExam(
        exam_id
    );

};

/**
 * Get Marks By Course Offering
 */
export const getMarksByCourseOfferingService = async (
    course_offering_id
) => {

    return await getMarksByCourseOffering(
        course_offering_id
    );

};

/**
 * Update Marks
 */
export const updateMarksService = async (
    id,
    data
) => {

    const mark = await getMarksById(id);

    if (mark.length === 0) {
        throw new Error("Marks not found.");
    }

    const exam = await findExamById(
        mark[0].exam_id
    );

    if (
        Number(data.marks_obtained) >
        Number(exam[0].total_marks)
    ) {

        throw new Error(
            `Marks cannot be greater than ${exam[0].total_marks}.`
        );

    }

    return await updateMarks(

        id,

        data.marks_obtained

    );

};

/**
 * Delete Marks
 */
export const deleteMarksService = async (id) => {

    const mark = await getMarksById(id);

    if (mark.length === 0) {
        throw new Error("Marks not found.");
    }

    return await deleteMarks(id);

};

/**
 * Student Result Summary
 */
export const getStudentResultSummaryService = async (
    student_id
) => {

    const subjects = await getStudentResultSummary(
        student_id
    );

    let overallObtained = 0;

    let overallTotal = 0;

    let creditsEarned = 0;

    let totalCredits = 0;

    subjects.forEach(subject => {

        subject.obtained_marks =
            Number(subject.obtained_marks);

        subject.total_marks =
            Number(subject.total_marks);

        subject.credits =
            Number(subject.credits);

        subject.percentage = Number(
            (
                (subject.obtained_marks /
                    subject.total_marks) * 100
            ).toFixed(2)
        );

        if (subject.percentage >= 90)
            subject.grade = "A";

        else if (subject.percentage >= 80)
            subject.grade = "B";

        else if (subject.percentage >= 70)
            subject.grade = "C";

        else if (subject.percentage >= 60)
            subject.grade = "D";

        else
            subject.grade = "F";

        subject.pass_status =
            subject.grade === "F"
                ? "FAIL"
                : "PASS";

        if (subject.pass_status === "PASS") {

            creditsEarned +=
                subject.credits;

        }

        totalCredits +=
            subject.credits;

        overallObtained +=
            subject.obtained_marks;

        overallTotal +=
            subject.total_marks;

    });

    return {

        subjects,

        overallObtained,

        overallTotal,

        overallPercentage: Number(
            (
                (overallObtained /
                    overallTotal) * 100
            ).toFixed(2)
        ),

        creditsEarned,

        totalCredits

    };

};