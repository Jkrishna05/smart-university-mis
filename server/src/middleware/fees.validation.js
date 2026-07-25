import Joi from "joi";

/**
 * Create Fee Validation
 */
export const createFeeSchema = Joi.object({

    student_id: Joi.number()
        .integer()
        .required(),

    fee_type: Joi.string()
        .max(50)
        .required(),

    semester: Joi.number()
        .integer()
        .min(1)
        .max(8)
        .required(),

    academic_year: Joi.string()
        .max(20)
        .required(),

    total_amount: Joi.number()
        .positive()
        .required(),

    amount_paid: Joi.number()
        .min(0)
        .default(0),

    due_date: Joi.date()
        .required()

});


/**
 * Update Fee Validation
 */
export const updateFeeSchema = Joi.object({

    fee_type: Joi.string()
        .max(50)
        .required(),

    semester: Joi.number()
        .integer()
        .min(1)
        .max(8)
        .required(),

    academic_year: Joi.string()
        .max(20)
        .required(),

    total_amount: Joi.number()
        .positive()
        .required(),

    amount_paid: Joi.number()
        .min(0)
        .required(),

    due_date: Joi.date()
        .required()

});


/**
 * Update Payment Validation
 */
export const updatePaymentSchema = Joi.object({

    paymentAmount: Joi.number()
        .positive()
        .required()

});


/**
 * ID Param Validation
 */
export const idParamSchema = Joi.object({

    id: Joi.number()
        .integer()
        .required()

});


/**
 * Student ID Param Validation
 */
export const studentIdParamSchema = Joi.object({

    student_id: Joi.number()
        .integer()
        .required()

});