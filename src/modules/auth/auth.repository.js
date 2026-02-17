const pool = require('../../infrastructure/database/pool');

exports.findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, email FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};

exports.createUser = async ({ email, passwordHash }) => {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, role, created_at`,
    [email, passwordHash]
  );

  return result.rows[0];
};
