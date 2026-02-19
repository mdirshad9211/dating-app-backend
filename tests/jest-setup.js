require("dotenv").config({ path: ".env.test" });
const pool = require("../src/infrastructure/database/pool");

module.exports = async () => {
  try {
    await pool.query("SELECT 1");
  } catch {
    global.SKIP_DB_TESTS = "true";
    console.warn(
      "Database not available for tests, skipping DB-dependent suites.",
    );
  }
};
