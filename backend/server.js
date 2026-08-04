require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./src/models');
const { errorHandler } = require('./src/middleware/errorHandler');
const { rateLimiter } = require('./src/middleware/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const seedDatabase = require('./src/database/seeders/seed');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const studentRoutes = require('./src/routes/student.routes');
const facultyRoutes = require('./src/routes/faculty.routes');
const departmentRoutes = require('./src/routes/department.routes');
const courseRoutes = require('./src/routes/course.routes');
const courseOfferingRoutes = require('./src/routes/courseOffering.routes');
const enrollmentRoutes = require('./src/routes/enrollment.routes');
const attendanceRoutes = require('./src/routes/attendance.routes');
const examRoutes = require('./src/routes/exam.routes');
const resultRoutes = require('./src/routes/result.routes');
const userRoutes = require('./src/routes/user.routes');
const reportRoutes = require('./src/routes/report.routes');
const feeRoutes = require('./src/routes/fee.routes');
const hostelRoutes = require('./src/routes/hostel.routes');
const libraryRoutes = require('./src/routes/library.routes');
const inventoryRoutes = require('./src/routes/inventory.routes');
const messageRoutes = require('./src/routes/message.routes');
const eventRoutes = require('./src/routes/event.routes');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(rateLimiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'University MIS API Documentation'
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/course-offerings', courseOfferingRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/events', eventRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized.');

    // Seed database with initial data
    await seedDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Docs available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(startServer, 5000);
  }
};

startServer();

module.exports = app;
