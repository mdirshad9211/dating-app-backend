const authService = require('./auth.service');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.registerUser({ email, password });

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });

  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: 'Email already registered' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
