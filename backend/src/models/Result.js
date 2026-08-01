const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
  result_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'student_id' }
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'exams', key: 'exam_id' }
  },
  marks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  grade: {
    type: DataTypes.STRING(5),
    allowNull: true
  }
}, {
  tableName: 'results',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Result;
