const bcrypt = require('bcrypt');
const authRepository = require('./auth.repository');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../../infrastructure/database/pool');


exports.registerUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('INVALID_INPUT');
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await authRepository.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await authRepository.createUser({
    email: normalizedEmail,
    passwordHash,
  });

  return user;
};



exports.loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();

  const user = await authRepository.findUserWithPassword(normalizedEmail);

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (user.is_banned) {
    throw new Error('USER_BANNED');
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Enforce max 3 sessions
    const sessions = await client.query(
      `SELECT id FROM user_sessions
       WHERE user_id = $1 AND is_revoked = false
       ORDER BY created_at ASC`,
      [user.id]
    );

    if (sessions.rows.length >= 3) {
      await client.query(
        `DELETE FROM user_sessions
         WHERE id = $1`,
        [sessions.rows[0].id]
      );
    }

    const sessionId = crypto.randomUUID();

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, sessionId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await client.query(
      `INSERT INTO user_sessions
       (id, user_id, refresh_token_hash, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')`,
      [sessionId, user.id, refreshTokenHash]
    );

    await client.query('COMMIT');

    return { accessToken, refreshToken };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

