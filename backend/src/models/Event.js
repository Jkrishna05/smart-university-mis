const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  event_type: {
    type: DataTypes.ENUM('Workshop', 'Seminar', 'Cultural', 'Sports', 'Academic', 'Holiday'),
    allowNull: false,
    defaultValue: 'Academic'
  },
  event_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(150),
    allowNull: false,
    defaultValue: 'Main Campus Auditorium'
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Event;
