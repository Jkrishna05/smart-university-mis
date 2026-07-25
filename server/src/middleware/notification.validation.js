import { body } from "express-validator";

/**
 * Create Notification Validation
 */
export const createNotificationValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .isLength({ min: 3, max: 150 })
        .withMessage("Title must be between 3 and 150 characters."),

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required.")
        .isLength({ min: 5 })
        .withMessage("Message must be at least 5 characters long."),

    body("notification_type")
        .notEmpty()
        .withMessage("Notification type is required.")
        .isIn([
            "general",
            "attendance",
            "exam",
            "marks",
            "fee"
        ])
        .withMessage(
            "Notification type must be general, attendance, exam, marks or fee."
        ),

    body("target_role")
        .optional()
        .isIn([
            "student",
            "faculty",
            "admin",
            "all"
        ])
        .withMessage(
            "Target role must be student, faculty, admin or all."
        ),

    body("target_user_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Target User ID must be a valid integer."),

    body("source_module")
        .optional()
        .isIn([
            "attendance",
            "exam",
            "marks",
            "fees",
            "system"
        ])
        .withMessage(
            "Source module must be attendance, exam, marks, fees or system."
        )

];

/**
 * Update Notification Validation
 */
export const updateNotificationValidation = [

    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage("Title must be between 3 and 150 characters."),

    body("message")
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage("Message must be at least 5 characters long."),

    body("notification_type")
        .optional()
        .isIn([
            "general",
            "attendance",
            "exam",
            "marks",
            "fee"
        ])
        .withMessage(
            "Notification type must be general, attendance, exam, marks or fee."
        ),

    body("target_role")
        .optional()
        .isIn([
            "student",
            "faculty",
            "admin",
            "all"
        ])
        .withMessage(
            "Target role must be student, faculty, admin or all."
        ),

    body("target_user_id")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Target User ID must be a valid integer."),

    body("source_module")
        .optional()
        .isIn([
            "attendance",
            "exam",
            "marks",
            "fees",
            "system"
        ])
        .withMessage(
            "Source module must be attendance, exam, marks, fees or system."
        )

];