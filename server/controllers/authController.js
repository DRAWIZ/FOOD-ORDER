const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Check for user by email or phone
    const user = await User.findOne({
      $or: [{ email: login }, { phone: login }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create admin account (only for initial setup)
// @route   POST /api/auth/createadmin
// @access  Public (should be secured in production)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin
    const admin = await User.create({
      name,
      email,
      phone,
      password,
      role: 'admin'
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        token: generateToken(admin._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};