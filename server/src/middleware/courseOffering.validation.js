import { body } from "express-validator";

/**
 * Create Course Offering Validation
 */
export const createCourseOfferingValidation = [

    body("course_id")
        .notEmpty()
        .withMessage("Course ID is required.")
        .isInt({ min: 1 })
        .withMessage("Course ID must be a valid integer."),

    body("faculty_id")
        .notEmpty()
        .withMessage("Faculty ID is required.")
        .isInt({ min: 1 })
        .withMessage("Faculty ID must be a valid integer."),

    body("academic_year")
        .notEmpty()
        .withMessage("Academic year is required.")
        .isLength({ min: 4, max: 20 })
        .withMessage("Academic year is invalid."),

    body("semester")
        .notEmpty()
        .withMessage("Semester is required.")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8."),

    body("section")
        .notEmpty()
        .withMessage("Section is required.")
        .isLength({ min: 1, max: 5 })
        .withMessage("Section is invalid."),

    body("max_students")
        .notEmpty()
        .withMessage("Maximum students is required.")
        .isInt({ min: 1 })
        .withMessage("Maximum students must be greater than 0.")

];

/**
 * Update Course Offering Validation
 */
export const updateCourseOfferingValidation = [

    body("faculty_id")
        .notEmpty()
        .withMessage("Faculty ID is required.")
        .isInt({ min: 1 })
        .withMessage("Faculty ID must be a valid integer."),

    body("section")
        .notEmpty()
        .withMessage("Section is required.")
        .isLength({ min: 1, max: 5 })
        .withMessage("Section is invalid."),

    body("max_students")
        .notEmpty()
        .withMessage("Maximum students is required.")
        .isInt({ min: 1 })
        .withMessage("Maximum students must be greater than 0.")

];