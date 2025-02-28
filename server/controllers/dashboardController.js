const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start of current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Count total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Count today's orders
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Count monthly orders
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    // Count orders by status
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const preparingOrders = await Order.countDocuments({ status: 'preparing' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    
    // Calculate today's revenue
    const todayRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    // Calculate monthly revenue
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    // Get top 5 selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          count: { $sum: '$orderItems.quantity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$productInfo.name',
          price: '$productInfo.price'
        }
      }
    ]);
    
    // Send dashboard data
    res.json({
      users: {
        total: totalUsers
      },
      orders: {
        today: todayOrders,
        monthly: monthlyOrders,
        pending: pendingOrders,
        preparing: preparingOrders,
        completed: completedOrders
      },
      revenue: {
        today: todayRevenue.length > 0 ? todayRevenue[0].total : 0,
        monthly: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0
      },
      topProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};