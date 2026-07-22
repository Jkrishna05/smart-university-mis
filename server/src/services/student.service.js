import bcrypt from "bcrypt";
import db from "../config/db.js";

import {
    createStudentUser,
    createStudent,
    findUserByEmail,
    findStudentByRegistrationNo,
    findDepartmentById,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from "../repositories/student.repository.js";

/**
 * Create Student
 */
export const createStudentService = async (data) => {

    const {
        name,
        email,
        password,
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
    } = data;

    // Check Email
    const emailExist = await findUserByEmail(email);

    if (emailExist.length > 0) {
        throw new Error("Email already exists.");
    }

    // Check Registration Number
    const regExist = await findStudentByRegistrationNo(
        registration_no
    );

    if (regExist.length > 0) {
        throw new Error("Registration number already exists.");
    }

    // Check Department
    const department = await findDepartmentById(
        department_id
    );

    if (department.length === 0) {
        throw new Error("Department not found.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const user = await createStudentUser(
            connection,
            name,
            email,
            hashedPassword
        );

        await createStudent(
            connection,
            user.insertId,
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
        );

        await connection.commit();

        return {
            id: user.insertId,
            name,
            email,
            registration_no
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

/**
 * Get All Students
 */
export const getStudentsService = async () => {

    return await getAllStudents();

};

/**
 * Get Student By ID
 */
export const getStudentByIdService = async (id) => {

    const student = await getStudentById(id);

    if (student.length === 0) {
        throw new Error("Student not found.");
    }

    return student[0];

};

/**
 * Update Student
 */
export const updateStudentService = async (
    id,
    data
) => {

    const student = await getStudentById(id);

    if (student.length === 0) {
        throw new Error("Student not found.");
    }

    const department = await findDepartmentById(
        data.department_id
    );

    if (department.length === 0) {
        throw new Error("Department not found.");
    }

    await updateStudent(
        id,
        data.department_id,
        data.current_semester,
        data.section,
        data.dob,
        data.gender,
        data.phone,
        data.guardian_name,
        data.guardian_phone,
        data.address
    );

    return {
        message: "Student updated successfully."
    };

};

/**
 * Delete Student
 */
export const deleteStudentService = async (id) => {

    const student = await getStudentById(id);

    if (student.length === 0) {
        throw new Error("Student not found.");
    }

    await deleteStudent(id);

};