// Load environment variables from .env file
require('dotenv').config();

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log('Database Terhubung');
  }
});

module.exports = connection;
