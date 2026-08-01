const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'University MIS API',
      version: '1.0.0',
      description: 'University Management Information System REST API Documentation',
      contact: {
        name: 'University MIS Admin',
        email: 'admin@university.edu'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['Admin', 'Faculty', 'Student'] },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        Student: {
          type: 'object',
          properties: {
            student_id: { type: 'integer' },
            user_id: { type: 'integer' },
            department_id: { type: 'integer' },
            roll_no: { type: 'string' },
            registration_no: { type: 'string' },
            semester: { type: 'integer' },
            year: { type: 'integer' },
            phone: { type: 'string' },
            address: { type: 'string' },
            guardian_name: { type: 'string' },
            guardian_phone: { type: 'string' }
          }
        },
        Faculty: {
          type: 'object',
          properties: {
            faculty_id: { type: 'integer' },
            user_id: { type: 'integer' },
            department_id: { type: 'integer' },
            designation: { type: 'string' },
            qualification: { type: 'string' },
            phone: { type: 'string' }
          }
        },
        Department: {
          type: 'object',
          properties: {
            department_id: { type: 'integer' },
            department_name: { type: 'string' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            course_id: { type: 'integer' },
            department_id: { type: 'integer' },
            course_name: { type: 'string' },
            course_code: { type: 'string' },
            credits: { type: 'integer' }
          }
        },
        CourseOffering: {
          type: 'object',
          properties: {
            offering_id: { type: 'integer' },
            course_id: { type: 'integer' },
            faculty_id: { type: 'integer' },
            semester: { type: 'integer' },
            year: { type: 'integer' },
            section: { type: 'string' }
          }
        },
        Enrollment: {
          type: 'object',
          properties: {
            enrollment_id: { type: 'integer' },
            student_id: { type: 'integer' },
            offering_id: { type: 'integer' }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            attendance_id: { type: 'integer' },
            student_id: { type: 'integer' },
            offering_id: { type: 'integer' },
            date: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['Present', 'Absent', 'Late'] }
          }
        },
        Exam: {
          type: 'object',
          properties: {
            exam_id: { type: 'integer' },
            course_id: { type: 'integer' },
            exam_name: { type: 'string' },
            total_marks: { type: 'integer' },
            exam_date: { type: 'string', format: 'date' }
          }
        },
        Result: {
          type: 'object',
          properties: {
            result_id: { type: 'integer' },
            student_id: { type: 'integer' },
            exam_id: { type: 'integer' },
            marks: { type: 'number' },
            grade: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                totalPages: { type: 'integer' }
              }
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
