const { beforeEach, afterAll } = require("@jest/globals");
const pool = require("../src/infrastructure/database/pool");

beforeEach(async () => {
  if (global.SKIP_DB_TESTS === "true") {
    return;
  }

  await pool.query("DELETE FROM user_sessions");
  await pool.query("DELETE FROM users");
});

afterAll(async () => {
  try {
    await pool.end();
  } catch {
    // Ignore teardown errors when DB was not available.
  }
});
