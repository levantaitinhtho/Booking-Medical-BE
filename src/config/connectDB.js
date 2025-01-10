const { Sequelize } = require('sequelize');
require('dotenv').config(); // Đảm bảo đọc các biến môi trường từ .env

const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME, // Tên database
  process.env.DB_USERNAME,      // Username
  process.env.DB_PASSWORD,      // Password
  {
    host: process.env.DB_HOST,          // Host từ Aiven
    port: process.env.DB_PORT,          // Port từ Aiven
    dialect: process.env.DB_DIALECT,    // Dialect (postgres hoặc mysql)
    logging: false,                     // Tắt logging
    dialectOptions: process.env.DB_SSL === 'true' 
      ? {
          ssl: {
            require: true, // Yêu cầu SSL
            rejectUnauthorized: false // Đặt thành true nếu Aiven yêu cầu xác thực
          }
        } 
      : {},
    timezone: '+07:00' // Set timezone nếu cần
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = connectDB;
