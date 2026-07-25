import { body } from "express-validator";

/**
 * Create Attendance Validation
 */
export const createAttendanceValidation = [

    body("enrollment_id")
        .notEmpty()
        .withMessage("Enrollment ID is required.")
        .isInt({ min: 1 })
        .withMessage("Enrollment ID must be a valid integer."),

    body("attendance_date")
        .notEmpty()
        .withMessage("Attendance date is required.")
        .isISO8601()
        .withMessage("Attendance date must be a valid date."),

    body("status")
        .notEmpty()
        .withMessage("Attendance status is required.")
        .isIn([
            "present",
            "absent",
            "late",
            "leave"
        ])
        .withMessage(
            "Status must be present, absent, late or leave."
        ),


];

/**
 * Update Attendance Validation
 */
export const updateAttendanceValidation = [

    body("status")
        .notEmpty()
        .withMessage("Attendance status is required.")
        .isIn([
            "present",
            "absent",
            "late",
            "leave"
        ])
        .withMessage(
            "Status must be present, absent, late or leave."
        ),


];