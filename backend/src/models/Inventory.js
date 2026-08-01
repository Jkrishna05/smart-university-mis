const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Lab Equipment'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 5000.00
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'departments', key: 'department_id' }
  },
  status: {
    type: DataTypes.ENUM('In Stock', 'Low Stock', 'Out of Stock'),
    defaultValue: 'In Stock'
  }
}, {
  tableName: 'inventory',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Inventory;
