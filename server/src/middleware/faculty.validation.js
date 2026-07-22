import { body } from "express-validator";

export const facultyValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("department_id")
        .notEmpty()
        .withMessage("Department is required")
        .isInt({ min: 1 })
        .withMessage("Invalid department id"),

    body("employee_id")
        .trim()
        .notEmpty()
        .withMessage("Employee ID is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Employee ID must be between 3 and 30 characters"),

    body("designation")
        .trim()
        .notEmpty()
        .withMessage("Designation is required"),

    body("qualification")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage("Qualification cannot exceed 150 characters"),

    body("experience")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Experience must be a positive number"),

    body("phone")
        .optional()
        .isMobilePhone("en-IN")
        .withMessage("Invalid phone number"),

    body("gender")
        .optional()
        .isIn(["male", "female", "other"])
        .withMessage("Invalid gender"),

    body("joining_date")
        .notEmpty()
        .withMessage("Joining date is required")
        .isDate()
        .withMessage("Invalid joining date"),

    body("salary")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Salary must be greater than or equal to 0")

];