import {

    // Admin
    getTotalStudents,
    getTotalFaculty,
    getTotalDepartments,
    getTotalCourses,
    getTotalCourseOfferings,
    getTotalEnrollments,
    getTodayAttendance,
    getRecentStudents,
    getRecentFaculty,
    getFeeSummary,
    getRecentNotices,

    // Student
    getStudentProfile,
    getStudentCGPA,
    getStudentAttendance,
    getStudentRegisteredCourses,
    getStudentCredits,
    getSubjectWiseAttendance,
    getUpcomingExams,
    getStudentFeeSummary,
    getRecentActivities,

    // Faculty
    getFacultyProfile,
    getFacultyCourses,
    getFacultyTodayClasses,
    getFacultyStudentCount,
    getFacultyPendingAttendance

} from "../repositories/dashboard.repository.js";


export const getDashboardService = async (user) => {

    switch (user.role) {

        /**
         * ============================
         * ADMIN DASHBOARD
         * ============================
         */
        case "admin": {

            const [

                totalStudents,

                totalFaculty,

                totalDepartments,

                totalCourses,

                totalCourseOfferings,

                totalEnrollments,

                todayAttendance,

                recentStudents,

                recentFaculty,

                feeSummary,

                recentNotices

            ] = await Promise.all([

                getTotalStudents(),

                getTotalFaculty(),

                getTotalDepartments(),

                getTotalCourses(),

                getTotalCourseOfferings(),

                getTotalEnrollments(),

                getTodayAttendance(),

                getRecentStudents(),

                getRecentFaculty(),

                getFeeSummary(),

                getRecentNotices()

            ]);

            return {

                statistics: {

                    totalStudents,

                    totalFaculty,

                    totalDepartments,

                    totalCourses,

                    totalCourseOfferings,

                    totalEnrollments

                },

                todayAttendance,

                feeSummary,

                recentStudents,

                recentFaculty,

                recentNotices

            };

        }


        /**
         * ============================
         * FACULTY DASHBOARD
         * ============================
         */
        case "faculty": {

            const profile = await getFacultyProfile(user.id);

            if (!profile) {

                throw new Error("Faculty not found.");

            }

            const facultyId = profile.id;

            const [

                courses,

                todayClasses,

                totalStudents,

                pendingAttendance

            ] = await Promise.all([

                getFacultyCourses(facultyId),

                getFacultyTodayClasses(facultyId),

                getFacultyStudentCount(facultyId),

                getFacultyPendingAttendance(facultyId)

            ]);

            return {

                profile,

                courses,

                todayClasses,

                totalStudents,

                pendingAttendance

            };

        }


        /**
         * ============================
         * STUDENT DASHBOARD
         * ============================
         */
        case "student": {

            const profile = await getStudentProfile(user.id);

            if (!profile) {

                throw new Error("Student not found.");

            }

            const studentId = profile.id;

            const [

                cgpa,

                attendance,

                registeredCourses,

                credits,

                subjectAttendance,

                upcomingExams,

                feeSummary,

                recentActivities

            ] = await Promise.all([

                getStudentCGPA(studentId),

                getStudentAttendance(studentId),

                getStudentRegisteredCourses(studentId),

                getStudentCredits(studentId),

                getSubjectWiseAttendance(studentId),

                getUpcomingExams(studentId),

                getStudentFeeSummary(studentId),

                getRecentActivities(studentId)

            ]);

            return {

                profile,

                cgpa,

                attendance,

                registeredCourses,

                credits,

                subjectAttendance,

                upcomingExams,

                feeSummary,

                recentActivities

            };

        }


        default:

            throw new Error("Invalid user role.");

    }

};