const bcrypt = require('bcrypt');
const authRepository = require('./auth.repository');

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
