const Joi = require('joi');

// ==========================================
// AUTH VALIDATORS
// ==========================================
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

// ==========================================
// USER VALIDATORS
// ==========================================
const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  password: Joi.string().min(6).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('Admin', 'Faculty', 'Student').required(),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(100),
  email: Joi.string().email(),
  role: Joi.string().valid('Admin', 'Faculty', 'Student'),
  status: Joi.string().valid('active', 'inactive'),
  password: Joi.string().min(6).max(100)
}).min(1);

// ==========================================
// STUDENT VALIDATORS
// ==========================================
const createStudentSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  department_id: Joi.number().integer().required(),
  roll_no: Joi.string().max(50).required(),
  registration_no: Joi.string().max(50).required(),
  semester: Joi.number().integer().min(1).max(8).required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
  phone: Joi.string().max(20).allow('', null),
  address: Joi.string().allow('', null),
  guardian_name: Joi.string().max(100).allow('', null),
  guardian_phone: Joi.string().max(20).allow('', null)
});

const updateStudentSchema = Joi.object({
  department_id: Joi.number().integer(),
  roll_no: Joi.string().max(50),
  registration_no: Joi.string().max(50),
  semester: Joi.number().integer().min(1).max(8),
  year: Joi.number().integer().min(2000).max(2100),
  phone: Joi.string().max(20).allow('', null),
  address: Joi.string().allow('', null),
  guardian_name: Joi.string().max(100).allow('', null),
  guardian_phone: Joi.string().max(20).allow('', null)
}).min(1);

// ==========================================
// FACULTY VALIDATORS
// ==========================================
const createFacultySchema = Joi.object({
  user_id: Joi.number().integer().required(),
  department_id: Joi.number().integer().required(),
  designation: Joi.string().max(100).required(),
  qualification: Joi.string().max(200).allow('', null),
  phone: Joi.string().max(20).allow('', null)
});

const updateFacultySchema = Joi.object({
  department_id: Joi.number().integer(),
  designation: Joi.string().max(100),
  qualification: Joi.string().max(200).allow('', null),
  phone: Joi.string().max(20).allow('', null)
}).min(1);

// ==========================================
// DEPARTMENT VALIDATORS
// ==========================================
const departmentSchema = Joi.object({
  department_name: Joi.string().max(100).required()
});

// ==========================================
// COURSE VALIDATORS
// ==========================================
const createCourseSchema = Joi.object({
  department_id: Joi.number().integer().required(),
  course_name: Joi.string().max(150).required(),
  course_code: Joi.string().max(20).required(),
  credits: Joi.number().integer().min(1).max(6).required()
});

const updateCourseSchema = Joi.object({
  department_id: Joi.number().integer(),
  course_name: Joi.string().max(150),
  course_code: Joi.string().max(20),
  credits: Joi.number().integer().min(1).max(6)
}).min(1);

// ==========================================
// COURSE OFFERING VALIDATORS
// ==========================================
const createCourseOfferingSchema = Joi.object({
  course_id: Joi.number().integer().required(),
  faculty_id: Joi.number().integer().required(),
  semester: Joi.number().integer().min(1).max(8).required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
  section: Joi.string().max(10).default('A')
});

const updateCourseOfferingSchema = Joi.object({
  course_id: Joi.number().integer(),
  faculty_id: Joi.number().integer(),
  semester: Joi.number().integer().min(1).max(8),
  year: Joi.number().integer().min(2000).max(2100),
  section: Joi.string().max(10)
}).min(1);

// ==========================================
// ENROLLMENT VALIDATORS
// ==========================================
const enrollmentSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  offering_id: Joi.number().integer().required()
});

// ==========================================
// ATTENDANCE VALIDATORS
// ==========================================
const createAttendanceSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  offering_id: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid('Present', 'Absent', 'Late').required()
});

const bulkAttendanceSchema = Joi.object({
  offering_id: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  records: Joi.array().items(
    Joi.object({
      student_id: Joi.number().integer().required(),
      status: Joi.string().valid('Present', 'Absent', 'Late').required()
    })
  ).min(1).required()
});

// ==========================================
// EXAM VALIDATORS
// ==========================================
const createExamSchema = Joi.object({
  course_id: Joi.number().integer().required(),
  exam_name: Joi.string().max(100).required(),
  total_marks: Joi.number().integer().min(1).required(),
  exam_date: Joi.date().iso().required()
});

const updateExamSchema = Joi.object({
  course_id: Joi.number().integer(),
  exam_name: Joi.string().max(100),
  total_marks: Joi.number().integer().min(1),
  exam_date: Joi.date().iso()
}).min(1);

// ==========================================
// RESULT VALIDATORS
// ==========================================
const createResultSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  exam_id: Joi.number().integer().required(),
  marks: Joi.number().min(0).required(),
  grade: Joi.string().max(5).allow('', null)
});

const updateResultSchema = Joi.object({
  marks: Joi.number().min(0),
  grade: Joi.string().max(5).allow('', null)
}).min(1);

// ==========================================
// VALIDATION MIDDLEWARE
// ==========================================
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errors = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  loginSchema,
  createUserSchema,
  updateUserSchema,
  createStudentSchema,
  updateStudentSchema,
  createFacultySchema,
  updateFacultySchema,
  departmentSchema,
  createCourseSchema,
  updateCourseSchema,
  createCourseOfferingSchema,
  updateCourseOfferingSchema,
  enrollmentSchema,
  createAttendanceSchema,
  bulkAttendanceSchema,
  createExamSchema,
  updateExamSchema,
  createResultSchema,
  updateResultSchema
};
