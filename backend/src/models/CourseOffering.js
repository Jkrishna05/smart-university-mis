const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseOffering = sequelize.define('CourseOffering', {
  offering_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'courses', key: 'course_id' }
  },
  faculty_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'faculty', key: 'faculty_id' }
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 8 }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'A'
  }
}, {
  tableName: 'course_offerings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = CourseOffering;
