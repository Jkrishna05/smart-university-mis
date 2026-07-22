import db from "../config/db.js";

/**
 * Create Department
 */
export const createDepartment = async (
    department_name,
    department_code,
    description
) => {

    const [result] = await db.execute(
        `
        INSERT INTO departments
        (
            department_name,
            department_code,
            description
        )
        VALUES
        (?, ?, ?)
        `,
        [
            department_name,
            department_code,
            description
        ]
    );

    return result;
};

/**
 * Get All Departments
 */
export const getAllDepartments = async () => {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            department_name,
            department_code,
            description,
            status,
            created_at,
            updated_at
        FROM departments
        WHERE status = 'active'
        ORDER BY department_name ASC
        `
    );

    return rows;
};

/**
 * Get Department By ID
 */
export const getDepartmentById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT
            id,
            department_name,
            department_code,
            description,
            status,
            created_at,
            updated_at
        FROM departments
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows;
};

/**
 * Check Department Code Exists
 */
export const findDepartmentByCode = async (department_code) => {

    const [rows] = await db.execute(
        `
        SELECT *
        FROM departments
        WHERE department_code = ?
        LIMIT 1
        `,
        [department_code]
    );

    return rows;
};

/**
 * Update Department
 */
export const updateDepartment = async (
    id,
    department_name,
    department_code,
    description
) => {

    const [result] = await db.execute(
        `
        UPDATE departments
        SET
            department_name = ?,
            department_code = ?,
            description = ?
        WHERE id = ?
        `,
        [
            department_name,
            department_code,
            description,
            id
        ]
    );

    return result;
};

/**
 * Soft Delete Department
 */
export const deleteDepartment = async (id) => {

    const [result] = await db.execute(
        `
        UPDATE departments
        SET status = 'inactive'
        WHERE id = ?
        `,
        [id]
    );

    return result;
};