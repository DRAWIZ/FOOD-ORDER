const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Get product details and calculate total price
    const orderItemsWithDetails = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        
        if (!product) {
          return res.status(404).json({ message: `Product ${item.product} not found` });
        }
        
        return {
          product: item.product,
          name: product.name,
          quantity: item.quantity,
          price: product.price
        };
      })
    );

    const totalPrice = orderItemsWithDetails.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.user._id,
      orderItems: orderItemsWithDetails,
      totalPrice
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name image');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name image');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email phone')
      .sort('-createdAt');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      
      const updatedOrder = await order.save();
      
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by token
// @route   GET /api/orders/token/:token
// @access  Public
exports.getOrderByToken = async (req, res) => {
  try {
    const order = await Order.findOne({ tokenNumber: req.params.token })
      .populate('orderItems.product', 'name image');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};