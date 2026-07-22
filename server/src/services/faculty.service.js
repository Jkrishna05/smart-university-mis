import bcrypt from "bcrypt";
import db from "../config/db.js";

import {
    createFacultyUser,
    createFaculty,
    findUserByEmail,
    findFacultyByEmployeeId,
    getAllFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty
} from "../repositories/faculty.repository.js";

import { getDepartmentById } from "../repositories/department.repository.js";

/**
 * Create Faculty
 */
export const createFacultyService = async (data) => {

    const {
        name,
        email,
        password,
        department_id,
        employee_id,
        designation,
        qualification,
        experience = 0,
        phone,
        gender,
        joining_date,
        salary
    } = data;

    // Check Email
    const emailExists = await findUserByEmail(email);

    if (emailExists.length > 0) {
        throw new Error("Faculty email already exists");
    }

    // Check Employee ID
    const employeeExists = await findFacultyByEmployeeId(employee_id);

    if (employeeExists.length > 0) {
        throw new Error("Employee ID already exists");
    }

    // Check Department
    const department = await getDepartmentById(department_id);

    if (department.length === 0) {
        throw new Error("Selected department does not exist");
    }

    if (department[0].status !== "active") {
        throw new Error("Selected department is inactive");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // Create User
        const userResult = await createFacultyUser(
            connection,
            name,
            email,
            hashedPassword
        );

        const user_id = userResult.insertId;

        // Create Faculty
        await createFaculty(
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
        );

        await connection.commit();

        return {
            id: user_id,
            name,
            email,
            employee_id,
            designation
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};

/**
 * Get All Faculty
 */
export const getFacultyService = async () => {

    return await getAllFaculty();

};

/**
 * Get Faculty By ID
 */
export const getFacultyByIdService = async (id) => {

    const faculty = await getFacultyById(id);

    if (faculty.length === 0) {
        throw new Error("Faculty not found");
    }

    return faculty[0];

};

/**
 * Update Faculty
 */
export const updateFacultyService = async (id, data) => {

    const faculty = await getFacultyById(id);

    if (faculty.length === 0) {
        throw new Error("Faculty not found");
    }

    const department = await getDepartmentById(data.department_id);

    if (department.length === 0) {
        throw new Error("Selected department does not exist");
    }

    await updateFaculty(
        id,
        data.department_id,
        data.designation,
        data.qualification,
        data.experience,
        data.phone,
        data.gender,
        data.joining_date,
        data.salary
    );

    return {
        message: "Faculty updated successfully"
    };

};

/**
 * Delete Faculty
 */
export const deleteFacultyService = async (id) => {

    const faculty = await getFacultyById(id);

    if (faculty.length === 0) {
        throw new Error("Faculty not found");
    }

    await deleteFaculty(id);

};