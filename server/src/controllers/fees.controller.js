import {

    createFeeService,

    getAllFeesService,

    getFeeByIdService,

    getFeesByStudentIdService,

    updateFeeService,

    updatePaymentService,

    deleteFeeService

} from "../services/fees.service.js";


/**
 * Create Fee
 */
export const createFee = async (req, res) => {

    try {

        const result = await createFeeService(req.body);

        return res.status(201).json({

            success: true,

            message: "Fee created successfully.",

            data: result

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


/**
 * Get All Fees
 */
export const getAllFees = async (req, res) => {

    try {

        const fees = await getAllFeesService();

        return res.status(200).json({

            success: true,

            data: fees

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/**
 * Get Fee By Id
 */
export const getFeeById = async (req, res) => {

    try {

        const fee = await getFeeByIdService(req.params.id);

        return res.status(200).json({

            success: true,

            data: fee

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};


/**
 * Get Fees By Student Id
 */
export const getFeesByStudentId = async (req, res) => {

    try {

        const fees = await getFeesByStudentIdService(req.params.student_id);

        return res.status(200).json({

            success: true,

            data: fees

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/**
 * Update Fee
 */
export const updateFee = async (req, res) => {

    try {

        const result = await updateFeeService(

            req.params.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            message: "Fee updated successfully.",

            data: result

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


/**
 * Update Payment
 */
export const updatePayment = async (req, res) => {

    try {

        const { paymentAmount } = req.body;

        const result = await updatePaymentService(

            req.params.id,

            paymentAmount

        );

        return res.status(200).json({

            success: true,

            message: "Payment updated successfully.",

            data: result

        });

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

};


/**
 * Delete Fee
 */
export const deleteFee = async (req, res) => {

    try {

        await deleteFeeService(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Fee deleted successfully."

        });

    } catch (error) {

        return res.status(404).json({

            success: false,

            message: error.message

        });

    }

};