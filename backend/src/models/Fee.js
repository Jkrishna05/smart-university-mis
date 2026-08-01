const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fee = sequelize.define('Fee', {
  fee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'student_id' }
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  academic_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2025
  },
  tuition_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 45000.00
  },
  exam_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 3000.00
  },
  hostel_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 12000.00
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 60000.00
  },
  paid_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  due_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 60000.00
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Partial'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'fees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Fee;
