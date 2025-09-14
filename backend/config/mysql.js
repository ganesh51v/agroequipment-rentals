const mysql = require('mysql2/promise');

const connectMySQL = async () => {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'ganesh@51v',
      database: process.env.MYSQL_DATABASE || 'Agro_rentals'
    });

    console.log('MySQL Connected successfully');
    return connection;
  } catch (error) {
    console.error('MySQL Connection Error:', error.message);
    process.exit(1);
  }
};

// Create database if it doesn't exist
const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'ganesh@51v'
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE || 'Agro_rentals'}`);
    await connection.end();
    console.log('Database created or already exists');
  } catch (error) {
    console.error('Database creation error:', error.message);
  }
};

module.exports = { connectMySQL, createDatabase };
