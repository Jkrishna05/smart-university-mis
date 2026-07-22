import db from "../config/db.js";

/**
 * Create User (role = student)
 */
export const createStudentUser = async (
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
        VALUES (?, ?, ?, 'student')
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
 * Create Student
 */
export const createStudent = async (
    connection,
    user_id,
    department_id,
    registration_no,
    admission_year,
    current_semester,
    section,
    dob,
    gender,
    phone,
    guardian_name,
    guardian_phone,
    address
) => {

    const [result] = await connection.execute(
        `
        INSERT INTO students
        (
            user_id,
            department_id,
            registration_no,
            admission_year,
            current_semester,
            section,
            dob,
            gender,
            phone,
            guardian_name,
            guardian_phone,
            address
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            department_id,
            registration_no,
            admission_year,
            current_semester,
            section,
            dob,
            gender,
            phone,
            guardian_name,
            guardian_phone,
            address
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
 * Find Student By Registration Number
 */
export const findStudentByRegistrationNo = async (registration_no) => {

    const [rows] = await db.execute(
        `
        SELECT *
        FROM students
        WHERE registration_no = ?
        LIMIT 1
        `,
        [registration_no]
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
 * Get All Students
 */
export const getAllStudents = async () => {

    const [rows] = await db.execute(
        `
        SELECT

            s.id,

            u.name,

            u.email,

            d.department_name,

            d.department_code,

            s.registration_no,

            s.admission_year,

            s.current_semester,

            s.section,

            s.phone,

            s.status,

            s.created_at

        FROM students s

        INNER JOIN users u
        ON s.user_id = u.id

        INNER JOIN departments d
        ON s.department_id = d.id

        WHERE s.status = 'active'

        ORDER BY u.name ASC
        `
    );

    return rows;
};

/**
 * Get Student By ID
 */
export const getStudentById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT

            s.id,

            s.user_id,

            s.department_id,

            u.name,

            u.email,

            d.department_name,

            d.department_code,

            s.registration_no,

            s.admission_year,

            s.current_semester,

            s.section,

            s.dob,

            s.gender,

            s.phone,

            s.guardian_name,

            s.guardian_phone,

            s.address,

            s.status,

            s.created_at,

            s.updated_at

        FROM students s

        INNER JOIN users u
        ON s.user_id = u.id

        INNER JOIN departments d
        ON s.department_id = d.id

        WHERE s.id = ?

        LIMIT 1
        `,
        [id]
    );

    return rows;
};

/**
 * Update Student
 */
export const updateStudent = async (
    id,
    department_id,
    current_semester,
    section,
    dob,
    gender,
    phone,
    guardian_name,
    guardian_phone,
    address
) => {

    const [result] = await db.execute(
        `
        UPDATE students
        SET
            department_id = ?,
            current_semester = ?,
            section = ?,
            dob = ?,
            gender = ?,
            phone = ?,
            guardian_name = ?,
            guardian_phone = ?,
            address = ?
        WHERE id = ?
        `,
        [
            department_id,
            current_semester,
            section,
            dob,
            gender,
            phone,
            guardian_name,
            guardian_phone,
            address,
            id
        ]
    );

    return result;
};

/**
 * Soft Delete Student
 */
export const deleteStudent = async (id) => {

    const [result] = await db.execute(
        `
        UPDATE students
        SET status = 'dropout'
        WHERE id = ?
        `,
        [id]
    );

    return result;
};