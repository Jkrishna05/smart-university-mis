const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'university_mis',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'university_mis_2024',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

module.exports = sequelize;
