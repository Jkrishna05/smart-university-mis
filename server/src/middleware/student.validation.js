import { body } from "express-validator";

export const createStudentValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),

    body("department_id")
        .notEmpty()
        .withMessage("Department is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid department id."),

    body("registration_no")
        .trim()
        .notEmpty()
        .withMessage("Registration number is required.")
        .isLength({ min: 5, max: 30 })
        .withMessage("Registration number must be between 5 and 30 characters."),

    body("admission_year")
        .notEmpty()
        .withMessage("Admission year is required.")
        .isInt({ min: 2000, max: 2100 })
        .withMessage("Invalid admission year."),

    body("current_semester")
        .notEmpty()
        .withMessage("Current semester is required.")
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8."),

    body("section")
        .optional()
        .trim()
        .isLength({ max: 10 })
        .withMessage("Section must not exceed 10 characters."),

    body("dob")
        .optional()
        .isISO8601()
        .withMessage("Invalid date of birth."),

    body("gender")
        .optional()
        .isIn(["male", "female", "other"])
        .withMessage("Invalid gender."),

    body("phone")
        .optional()
        .isMobilePhone()
        .withMessage("Invalid phone number."),

    body("guardian_name")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Guardian name is too long."),

    body("guardian_phone")
        .optional()
        .isMobilePhone()
        .withMessage("Invalid guardian phone number."),

    body("address")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Address is too long.")

];

export const updateStudentValidation = [

    body("department_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid department id."),

    body("current_semester")
        .optional()
        .isInt({ min: 1, max: 8 })
        .withMessage("Semester must be between 1 and 8."),

    body("section")
        .optional()
        .trim()
        .isLength({ max: 10 })
        .withMessage("Section must not exceed 10 characters."),

    body("dob")
        .optional()
        .isISO8601()
        .withMessage("Invalid date of birth."),

    body("gender")
        .optional()
        .isIn(["male", "female", "other"])
        .withMessage("Invalid gender."),

    body("phone")
        .optional()
        .isMobilePhone()
        .withMessage("Invalid phone number."),

    body("guardian_name")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Guardian name is too long."),

    body("guardian_phone")
        .optional()
        .isMobilePhone()
        .withMessage("Invalid guardian phone number."),

    body("address")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Address is too long.")

];