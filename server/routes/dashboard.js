const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/', protect, admin, getDashboardStats);

module.exports = router;