const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LibraryBorrow = sequelize.define('LibraryBorrow', {
  borrow_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'student_id' }
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'books', key: 'book_id' }
  },
  issue_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Issued', 'Returned', 'Overdue'),
    allowNull: false,
    defaultValue: 'Issued'
  }
}, {
  tableName: 'library_borrows',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = LibraryBorrow;
