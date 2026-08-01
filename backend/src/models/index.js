const sequelize = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Faculty = require('./Faculty');
const Admin = require('./Admin');
const Department = require('./Department');
const Course = require('./Course');
const CourseOffering = require('./CourseOffering');
const Enrollment = require('./Enrollment');
const Attendance = require('./Attendance');
const Exam = require('./Exam');
const Result = require('./Result');
const AuditLog = require('./AuditLog');
const Fee = require('./Fee');
const Hostel = require('./Hostel');
const Book = require('./Book');
const LibraryBorrow = require('./LibraryBorrow');
const Inventory = require('./Inventory');
const Message = require('./Message');
const Event = require('./Event');

// Associations
User.hasOne(Student, { foreignKey: 'user_id', as: 'student' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Faculty, { foreignKey: 'user_id', as: 'faculty' });
Faculty.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Admin, { foreignKey: 'user_id', as: 'admin' });
Admin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Department.hasMany(Student, { foreignKey: 'department_id', as: 'students' });
Student.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

Department.hasMany(Faculty, { foreignKey: 'department_id', as: 'facultyMembers' });
Faculty.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

Department.hasMany(Course, { foreignKey: 'department_id', as: 'courses' });
Course.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

Course.hasMany(CourseOffering, { foreignKey: 'course_id', as: 'offerings' });
CourseOffering.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Faculty.hasMany(CourseOffering, { foreignKey: 'faculty_id', as: 'courseOfferings' });
CourseOffering.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'faculty' });

CourseOffering.hasMany(Enrollment, { foreignKey: 'offering_id', as: 'enrollments' });
Enrollment.belongsTo(CourseOffering, { foreignKey: 'offering_id', as: 'courseOffering' });

Student.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Enrollment.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

CourseOffering.hasMany(Attendance, { foreignKey: 'offering_id', as: 'attendanceRecords' });
Attendance.belongsTo(CourseOffering, { foreignKey: 'offering_id', as: 'courseOffering' });

Student.hasMany(Attendance, { foreignKey: 'student_id', as: 'attendanceRecords' });
Attendance.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Course.hasMany(Exam, { foreignKey: 'course_id', as: 'exams' });
Exam.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Student.hasMany(Result, { foreignKey: 'student_id', as: 'results' });
Result.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Exam.hasMany(Result, { foreignKey: 'exam_id', as: 'results' });
Result.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Student.hasMany(Fee, { foreignKey: 'student_id', as: 'fees' });
Fee.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Hostel
Student.hasOne(Hostel, { foreignKey: 'student_id', as: 'hostel' });
Hostel.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Library
Book.hasMany(LibraryBorrow, { foreignKey: 'book_id', as: 'borrows' });
LibraryBorrow.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
Student.hasMany(LibraryBorrow, { foreignKey: 'student_id', as: 'libraryBorrows' });
LibraryBorrow.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Inventory
Department.hasMany(Inventory, { foreignKey: 'department_id', as: 'inventoryItems' });
Inventory.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Message (Sender & Receiver)
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

module.exports = {
  sequelize,
  User,
  Student,
  Faculty,
  Admin,
  Department,
  Course,
  CourseOffering,
  Enrollment,
  Attendance,
  Exam,
  Result,
  AuditLog,
  Fee,
  Hostel,
  Book,
  LibraryBorrow,
  Inventory,
  Message,
  Event
};
