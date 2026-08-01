const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  exam_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'courses', key: 'course_id' }
  },
  exam_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  total_marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  exam_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'exams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Exam;
