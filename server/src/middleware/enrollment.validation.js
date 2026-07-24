    import { body } from "express-validator";

/**
 * Create Enrollment Validation
 */
export const createEnrollmentValidation = [

    body("student_id")
        .notEmpty()
        .withMessage("Student ID is required.")
        .isInt({ min: 1 })
        .withMessage("Student ID must be a valid integer."),

    body("course_offering_id")
        .notEmpty()
        .withMessage("Course Offering ID is required.")
        .isInt({ min: 1 })
        .withMessage("Course Offering ID must be a valid integer."),

    body("enrollment_date")
        .notEmpty()
        .withMessage("Enrollment date is required.")
        .isISO8601()
        .withMessage("Enrollment date must be a valid date.")

];

/**
 * Update Enrollment Validation
 */
export const updateEnrollmentValidation = [

    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .isIn([
            "enrolled",
            "dropped",
            "completed"
        ])
        .withMessage(
            "Status must be enrolled, dropped or completed."
        )

];