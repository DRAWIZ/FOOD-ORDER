const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  createAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/createadmin
// @desc    Create admin account (only for initial setup)
// @access  Public (should be secured in production)
router.post('/createadmin', createAdmin);

module.exports = router;