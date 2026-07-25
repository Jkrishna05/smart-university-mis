import { body } from "express-validator";

/**
 * Create Exam Validation
 */
export const createExamValidation = [

    body("course_offering_id")
        .notEmpty()
        .withMessage("Course Offering ID is required.")
        .isInt({ min: 1 })
        .withMessage("Course Offering ID must be a valid integer."),

    body("exam_name")
        .trim()
        .notEmpty()
        .withMessage("Exam name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Exam name must be between 2 and 100 characters."),

    body("exam_type")
        .notEmpty()
        .withMessage("Exam type is required.")
        .isIn([
            "quiz",
            "assignment",
            "lab",
            "midterm",
            "end_sem"
        ])
        .withMessage(
            "Exam type must be quiz, assignment, lab, midterm or end_sem."
        ),

    body("exam_date")
        .notEmpty()
        .withMessage("Exam date is required.")
        .isISO8601()
        .withMessage("Exam date must be a valid date."),

    body("total_marks")
        .notEmpty()
        .withMessage("Total marks is required.")
        .isFloat({ min: 1 })
        .withMessage("Total marks must be greater than 0.")

];

/**
 * Update Exam Validation
 */
export const updateExamValidation = [

    body("exam_name")
        .trim()
        .notEmpty()
        .withMessage("Exam name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Exam name must be between 2 and 100 characters."),

    body("exam_type")
        .notEmpty()
        .withMessage("Exam type is required.")
        .isIn([
            "quiz",
            "assignment",
            "lab",
            "midterm",
            "end_sem"
        ])
        .withMessage(
            "Exam type must be quiz, assignment, lab, midterm or end_sem."
        ),

    body("exam_date")
        .notEmpty()
        .withMessage("Exam date is required.")
        .isISO8601()
        .withMessage("Exam date must be a valid date."),

    body("total_marks")
        .notEmpty()
        .withMessage("Total marks is required.")
        .isFloat({ min: 1 })
        .withMessage("Total marks must be greater than 0.")

];