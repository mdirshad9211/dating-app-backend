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



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const tokens = await authService.loginUser({ email, password });

    return res.status(200).json({
      message: 'Login successful',
      ...tokens,
    });

  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (error.message === 'USER_BANNED') {
      return res.status(403).json({ message: 'User is banned' });
    }

    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

