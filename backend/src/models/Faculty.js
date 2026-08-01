const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Faculty = sequelize.define('Faculty', {
  faculty_id: {
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
  designation: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'faculty',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Faculty;
