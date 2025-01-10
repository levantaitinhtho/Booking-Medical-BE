const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME, // Database name
  process.env.DB_USERNAME,      // Username
  process.env.DB_PASSWORD,      // Password
  {
    host: process.env.DB_HOST,  // Host (Aiven connection string)
    port: process.env.DB_PORT,  // Port
    dialect: process.env.DB_DIALECT, // Database type (mysql)
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === 'true', // Use SSL if enabled
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    },
    logging: false, // Disable SQL logging for cleaner logs
  }
);

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = connectDB;
