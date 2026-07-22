import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    findDepartmentByCode,
    updateDepartment,
    deleteDepartment
} from "../repositories/department.repository.js";

/**
 * Create Department
 */
export const createDepartmentService = async (data) => {

    const {
        department_name,
        department_code,
        description
    } = data;

    const department = await findDepartmentByCode(department_code);

    if (department.length > 0) {
        throw new Error("Department code already exists");
    }

    const result = await createDepartment(
        department_name,
        department_code,
        description
    );

    return {
        id: result.insertId,
        department_name,
        department_code,
        description
    };
};

/**
 * Get All Departments
 */
export const getDepartmentsService = async () => {

    return await getAllDepartments();

};

/**
 * Get Department By ID
 */
export const getDepartmentService = async (id) => {

    const department = await getDepartmentById(id);

    if (department.length === 0) {
        throw new Error("Department not found");
    }

    return department[0];

};

/**
 * Update Department
 */
export const updateDepartmentService = async (id, data) => {

    const {
        department_name,
        department_code,
        description
    } = data;

    const department = await getDepartmentById(id);

    if (department.length === 0) {
        throw new Error("Department not found");
    }

    const existingDepartment = await findDepartmentByCode(department_code);

    if (
        existingDepartment.length > 0 &&
        existingDepartment[0].id != id
    ) {
        throw new Error("Department code already exists");
    }

    await updateDepartment(
        id,
        department_name,
        department_code,
        description
    );

    return {
        id,
        department_name,
        department_code,
        description
    };

};

/**
 * Delete Department
 */
export const deleteDepartmentService = async (id) => {

    const department = await getDepartmentById(id);

    if (department.length === 0) {
        throw new Error("Department not found");
    }

    await deleteDepartment(id);

};