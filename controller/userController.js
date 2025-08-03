const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure correct path to your User model

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const secretKey = process.env.JWT_SECRET;

  try {
    // Find user by username and password (plaintext match as per your current setup)
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };
