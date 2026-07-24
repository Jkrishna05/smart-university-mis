import {

    createCourseOffering,

    findCourseById,

    findFacultyById,

    findCourseOffering,

    getAllCourseOfferings,

    getCourseOfferingById,

    getCourseOfferingsByFaculty,

    getCourseOfferingsBySemester,

    updateCourseOffering,

    deleteCourseOffering

} from "../repositories/courseOffering.repository.js";

/**
 * Create Course Offering
 */
export const createCourseOfferingService = async (data) => {

    const {

        course_id,

        faculty_id,

        academic_year,

        semester,

        section,

        max_students

    } = data;

    // Check Course
    const course = await findCourseById(course_id);

    if (course.length === 0) {
        throw new Error("Course not found");
    }

    // Check Faculty
    const faculty = await findFacultyById(faculty_id);

    if (faculty.length === 0) {
        throw new Error("Faculty not found");
    }

    // Check Duplicate
    const offering = await findCourseOffering(

        course_id,

        faculty_id,

        academic_year,

        semester,

        section

    );

    if (offering.length > 0) {
        throw new Error("Course offering already exists");
    }

    return await createCourseOffering(

        course_id,

        faculty_id,

        academic_year,

        semester,

        section,

        max_students

    );

};

/**
 * Get All Course Offerings
 */
export const getAllCourseOfferingsService = async () => {

    return await getAllCourseOfferings();

};

/**
 * Get Course Offering By ID
 */
export const getCourseOfferingByIdService = async (id) => {

    const offering = await getCourseOfferingById(id);

    if (offering.length === 0) {
        throw new Error("Course offering not found");
    }

    return offering[0];

};

/**
 * Get Course Offerings By Faculty
 */
export const getCourseOfferingsByFacultyService = async (faculty_id) => {

    return await getCourseOfferingsByFaculty(faculty_id);

};

/**
 * Get Course Offerings By Semester
 */
export const getCourseOfferingsBySemesterService = async (semester) => {

    return await getCourseOfferingsBySemester(semester);

};

/**
 * Update Course Offering
 */
export const updateCourseOfferingService = async (

    id,

    data

) => {

    const offering = await getCourseOfferingById(id);

    if (offering.length === 0) {
        throw new Error("Course offering not found");
    }

    const {

        faculty_id,

        section,

        max_students

    } = data;

    const faculty = await findFacultyById(faculty_id);

    if (faculty.length === 0) {
        throw new Error("Faculty not found");
    }

    return await updateCourseOffering(

        id,

        faculty_id,

        section,

        max_students

    );

};

/**
 * Delete Course Offering
 */
export const deleteCourseOfferingService = async (id) => {

    const offering = await getCourseOfferingById(id);

    if (offering.length === 0) {
        throw new Error("Course offering not found");
    }

    return await deleteCourseOffering(id);

};