const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  getOrderByToken
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders/myorders
// @desc    Get user orders
// @access  Private
router.get('/myorders', protect, getUserOrders);

// @route   GET /api/orders/token/:token
// @desc    Get order by token
// @access  Public
router.get('/token/:token', getOrderByToken);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, getOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;