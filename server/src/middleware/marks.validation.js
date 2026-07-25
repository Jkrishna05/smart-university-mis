import { body } from "express-validator";

/**
 * Create Marks Validation
 */
export const createMarksValidation = [

    body("enrollment_id")
        .notEmpty()
        .withMessage("Enrollment ID is required.")
        .isInt({ min: 1 })
        .withMessage("Enrollment ID must be a valid integer."),

    body("exam_id")
        .notEmpty()
        .withMessage("Exam ID is required.")
        .isInt({ min: 1 })
        .withMessage("Exam ID must be a valid integer."),

    body("marks_obtained")
        .notEmpty()
        .withMessage("Marks obtained is required.")
        .isFloat({ min: 0 })
        .withMessage("Marks obtained must be a valid number.")

];

/**
 * Update Marks Validation
 */
export const updateMarksValidation = [

    body("marks_obtained")
        .notEmpty()
        .withMessage("Marks obtained is required.")
        .isFloat({ min: 0 })
        .withMessage("Marks obtained must be a valid number.")

];