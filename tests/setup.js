require("dotenv").config({ path: ".env.test" });
const { beforeAll, beforeEach, afterAll } = require("@jest/globals");
const pool = require("../src/infrastructure/database/pool");

let dbAvailable = true;

beforeAll(async () => {
  try {
    await pool.query("SELECT 1");
  } catch (_error) {
    dbAvailable = false;
    process.env.SKIP_DB_TESTS = "true";
    console.warn(
      "Database not available for tests, skipping DB-dependent suites.",
    );
  }
});

beforeEach(async () => {
  if (!dbAvailable) {
    return;
  }

  await pool.query("DELETE FROM user_sessions");
  await pool.query("DELETE FROM users");
});

afterAll(async () => {
  try {
    await pool.end();
  } catch (_error) {
    // Ignore teardown errors when DB was not available.
  }
});
