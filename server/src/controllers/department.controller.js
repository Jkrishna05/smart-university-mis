    import {
    createDepartmentService,
    getDepartmentsService,
    getDepartmentService,
    updateDepartmentService,
    deleteDepartmentService
} from "../services/department.service.js";

/**
 * Create Department
 */
export const createDepartment = async (req, res) => {

    try {

        const department = await createDepartmentService(req.body);

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            department
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get All Departments
 */
export const getDepartments = async (req, res) => {

    try {

        const departments = await getDepartmentsService();

        return res.status(200).json({
            success: true,
            count: departments.length,
            departments
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get Department By ID
 */
export const getDepartment = async (req, res) => {

    try {

        const department = await getDepartmentService(req.params.id);

        return res.status(200).json({
            success: true,
            department
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Update Department
 */
export const updateDepartment = async (req, res) => {

    try {

        const department = await updateDepartmentService(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            department
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Delete Department
 */
export const deleteDepartment = async (req, res) => {

    try {

        await deleteDepartmentService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });

    } catch (error) {

        return res.status(404).json({
            success: false,
            message: error.message
        });

    }

};