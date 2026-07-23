import { body } from "express-validator";

/**
 * Create Course Validation
 */
export const createCourseValidation = [

    body("department_id")
        .notEmpty()
        .withMessage("Department is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid department id."),

    body("course_code")
        .trim()
        .notEmpty()
        .withMessage("Course code is required.")
        .isLength({ min: 2, max: 20 })
        .withMessage("Course code must be between 2 and 20 characters."),

    body("course_name")
        .trim()
        .notEmpty()
        .withMessage("Course name is required.")
        .isLength({ min: 3, max: 150 })
        .withMessage("Course name must be between 3 and 150 characters."),

    body("course_type")
        .notEmpty()
        .withMessage("Course type is required.")
        .isIn([
            "Core",
            "Elective",
            "Lab",
            "Project"
        ])
        .withMessage("Invalid course type."),

    body("credits")
        .notEmpty()
        .withMessage("Credits are required.")
        .isFloat({ min: 0.5, max: 10 })
        .withMessage("Credits must be between 0.5 and 10."),

    body("semester")
        .notEmpty()
        .withMessage("Semester is required.")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters.")

];


/**
 * Update Course Validation
 */
export const updateCourseValidation = [

    body("department_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid department id."),

    body("course_name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage("Course name must be between 3 and 150 characters."),

    body("course_type")
        .optional()
        .isIn([
            "Core",
            "Elective",
            "Lab",
            "Project"
        ])
        .withMessage("Invalid course type."),

    body("credits")
        .optional()
        .isFloat({ min: 0.5, max: 10 })
        .withMessage("Credits must be between 0.5 and 10."),

    body("semester")
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters.")

];