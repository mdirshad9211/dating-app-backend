const { Pool } = require("pg");

const defaultDatabase =
  process.env.NODE_ENV === "test" ? "dating_app_test" : "dating_app_dev";

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        user: process.env.DB_USER || "dating_app",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || defaultDatabase,
      },
);

module.exports = pool;
