const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'departments', key: 'department_id' }
  },
  course_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  course_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 6 }
  }
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Course;
