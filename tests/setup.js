require("dotenv").config({ path: ".env.test" });
const pool = require("../src/infrastructure/database/pool");

beforeEach(async () => {
  await pool.query("DELETE FROM user_sessions");
  await pool.query("DELETE FROM users");
});

afterAll(async () => {
  await pool.end();
});
