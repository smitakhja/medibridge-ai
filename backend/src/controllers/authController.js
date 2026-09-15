const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medibridge_jwt_secret_2024', {
    expiresIn: '7d',
  });
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, age, gender, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Only allow doctor/admin roles via admin panel in production
    const assignedRole = ['doctor', 'admin'].includes(role) ? role : 'user';

    const user = await User.create({ name, email, password, age, gender, phone, role: assignedRole });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
        language: user.language,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // In production, send email with reset link
  // For demo, just confirm the endpoint works
  res.json({
    success: true,
    message: user
      ? 'Password reset instructions sent to your email.'
      : 'If that email is registered, you will receive a reset link.',
  });
};

module.exports = { register, login, getMe, forgotPassword };
