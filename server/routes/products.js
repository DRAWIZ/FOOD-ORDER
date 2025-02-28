const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/products/upload
// @desc    Upload product image
// @access  Private/Admin
router.post('/upload', protect, admin, uploadProductImage);

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, createProduct);

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get a product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;