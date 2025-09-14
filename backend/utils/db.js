const mysql = require('mysql2/promise');

let connection;

const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'ganesh@51v',
      database: process.env.MYSQL_DATABASE || 'Agro_rentals'
    });
  }
  return connection;
};

module.exports = { getConnection };
