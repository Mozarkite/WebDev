//db.js
const { Pool } = require('pg');
require('dotenv').config();

//Gets info from the environment file
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {

});

//Manages connection to database
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connection successful, time:', res.rows[0]);
  }
});

module.exports = pool;

