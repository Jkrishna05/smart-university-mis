import {

    createCourse,

    findCourseByCode,

    findDepartmentById,

    getAllCourses,

    getCourseById,

    updateCourse,

    deleteCourse

} from "../repositories/course.repository.js";

/**
 * Create Course
 */
export const createCourseService = async (data) => {

    const {

        department_id,

        course_code,

        course_name,

        course_type,

        credits,

        semester,

        description

    } = data;

    // Check Department

    const department = await findDepartmentById(department_id);

    if (department.length === 0) {

        throw new Error("Department not found.");

    }

    // Check Course Code

    const course = await findCourseByCode(course_code);

    if (course.length > 0) {

        throw new Error("Course code already exists.");

    }

    const result = await createCourse(

        department_id,

        course_code,

        course_name,

        course_type,

        credits,

        semester,

        description

    );

    return {

        id: result.insertId,

        course_code,

        course_name

    };

};

/**
 * Get All Courses
 */
export const getCoursesService = async () => {

    return await getAllCourses();

};

/**
 * Get Course By ID
 */
export const getCourseByIdService = async (id) => {

    const course = await getCourseById(id);

    if (course.length === 0) {

        throw new Error("Course not found.");

    }

    return course[0];

};

/**
 * Update Course
 */
export const updateCourseService = async (

    id,

    data

) => {

    const course = await getCourseById(id);

    if (course.length === 0) {

        throw new Error("Course not found.");

    }

    const department = await findDepartmentById(

        data.department_id

    );

    if (department.length === 0) {

        throw new Error("Department not found.");

    }

    await updateCourse(

        id,

        data.department_id,

        data.course_name,

        data.course_type,

        data.credits,

        data.semester,

        data.description

    );

    return {

        message: "Course updated successfully."

    };

};

/**
 * Delete Course
 */
export const deleteCourseService = async (id) => {

    const course = await getCourseById(id);

    if (course.length === 0) {

        throw new Error("Course not found.");

    }

    await deleteCourse(id);

};