const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'dating_app',
  password: process.env.DB_PASSWORD,
  database: 'dating_app_dev',
});

module.exports = pool;
