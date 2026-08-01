const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'departments', key: 'department_id' }
  },
  roll_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  registration_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
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
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  guardian_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  guardian_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Student;
