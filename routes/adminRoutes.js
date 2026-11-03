const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = orders.filter((o) => new Date(o.createdAt) >= today);
    const todaysSales = todaysOrders.reduce((sum, o) => sum + o.total, 0);

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      totalRevenue,
      todaysSales,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
