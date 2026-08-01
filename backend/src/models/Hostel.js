const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hostel = sequelize.define('Hostel', {
  hostel_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'students', key: 'student_id' }
  },
  hostel_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Aryabhata Boys Hostel'
  },
  block: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Block A'
  },
  room_no: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  warden_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Dr. S. K. Nandi'
  },
  warden_phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '9876500112'
  },
  status: {
    type: DataTypes.ENUM('Occupied', 'Vacated'),
    defaultValue: 'Occupied'
  }
}, {
  tableName: 'hostels',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Hostel;
