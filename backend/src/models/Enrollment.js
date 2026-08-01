const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  enrollment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'student_id' }
  },
  offering_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'course_offerings', key: 'offering_id' }
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Enrollment;
