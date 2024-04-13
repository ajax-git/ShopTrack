const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "shoptrack",
  password: process.env.DB_PASS || "123",
  database: process.env.DB_NAME || "shoptrack",
});

module.exports = pool;
