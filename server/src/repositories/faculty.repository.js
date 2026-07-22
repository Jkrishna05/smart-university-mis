import db from "../config/db.js";

/**
 * Create User (role = faculty)
 */
export const createFacultyUser = async (
    connection,
    name,
    email,
    password
) => {

    const [result] = await connection.execute(
        `
        INSERT INTO users
        (
            name,
            email,
            password,
            role
        )
        VALUES (?, ?, ?, 'faculty')
        `,
        [
            name,
            email,
            password
        ]
    );

    return result;
};

/**
 * Create Faculty
 */
export const createFaculty = async (
    connection,
    user_id,
    department_id,
    employee_id,
    designation,
    qualification,
    experience,
    phone,
    gender,
    joining_date,
    salary
) => {

    const [result] = await connection.execute(
        `
        INSERT INTO faculty
        (
            user_id,
            department_id,
            employee_id,
            designation,
            qualification,
            experience,
            phone,
            gender,
            joining_date,
            salary
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            department_id,
            employee_id,
            designation,
            qualification,
            experience,
            phone,
            gender,
            joining_date,
            salary
        ]
    );

    return result;
};

/**
 * Find User By Email
 */
export const findUserByEmail = async (email) => {

    const [rows] = await db.execute(
        `
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows;
};

/**
 * Find Faculty By Employee ID
 */
export const findFacultyByEmployeeId = async (employee_id) => {

    const [rows] = await db.execute(
        `
        SELECT *
        FROM faculty
        WHERE employee_id = ?
        LIMIT 1
        `,
        [employee_id]
    );

    return rows;
};

/**
 * Check Department Exists
 */
export const findDepartmentById = async (department_id) => {

    const [rows] = await db.execute(
        `
        SELECT id
        FROM departments
        WHERE id = ?
        AND status = 'active'
        LIMIT 1
        `,
        [department_id]
    );

    return rows;
};

/**
 * Get All Faculty
 */
export const getAllFaculty = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            f.id,

            u.name,

            u.email,

            d.department_name,

            d.department_code,

            f.employee_id,

            f.designation,

            f.qualification,

            f.experience,

            f.phone,

            f.gender,

            f.joining_date,

            f.salary,

            f.status,

            f.created_at

        FROM faculty f

        INNER JOIN users u
        ON f.user_id = u.id

        INNER JOIN departments d
        ON f.department_id = d.id

        WHERE f.status = 'active'

        ORDER BY u.name ASC
        `
    );

    return rows;
};

/**
 * Get Faculty By ID
 */
export const getFacultyById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT

            f.id,

            f.user_id,

            f.department_id,

            u.name,

            u.email,

            d.department_name,

            d.department_code,

            f.employee_id,

            f.designation,

            f.qualification,

            f.experience,

            f.phone,

            f.gender,

            f.joining_date,

            f.salary,

            f.status,

            f.created_at,

            f.updated_at

        FROM faculty f

        INNER JOIN users u
        ON f.user_id = u.id

        INNER JOIN departments d
        ON f.department_id = d.id

        WHERE f.id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;
};

/**
 * Update Faculty
 */
export const updateFaculty = async (
    id,
    department_id,
    designation,
    qualification,
    experience,
    phone,
    gender,
    joining_date,
    salary
) => {

    const [result] = await db.execute(
        `
        UPDATE faculty
        SET
            department_id = ?,
            designation = ?,
            qualification = ?,
            experience = ?,
            phone = ?,
            gender = ?,
            joining_date = ?,
            salary = ?
        WHERE id = ?
        `,
        [
            department_id,
            designation,
            qualification,
            experience,
            phone,
            gender,
            joining_date,
            salary,
            id
        ]
    );

    return result;
};

/**
 * Soft Delete Faculty
 */
export const deleteFaculty = async (id) => {

    const [result] = await db.execute(
        `
        UPDATE faculty
        SET status = 'inactive'
        WHERE id = ?
        `,
        [id]
    );

    return result;
};