import { body, validationResult } from "express-validator";

/**
 * Department Validation
 */
export const departmentValidation = [

    body("department_name")
        .trim()
        .notEmpty()
        .withMessage("Department name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Department name must be between 3 and 100 characters"),

    body("department_code")
        .trim()
        .notEmpty()
        .withMessage("Department code is required")
        .isLength({ min: 2, max: 20 })
        .withMessage("Department code must be between 2 and 20 characters")
        .matches(/^[A-Za-z0-9_-]+$/)
        .withMessage("Department code can only contain letters, numbers, hyphen (-), and underscore (_)"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                errors: errors.array()
            });

        }

        next();

    }

];