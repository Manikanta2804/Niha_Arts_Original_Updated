const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { sendOrderConfirmationEmail, sendAdminOrderNotification } = require('../utils/sendEmail');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentApp, razorpayPaymentId } = req.body;

    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => {
      const discountedPrice = item.product.price - (item.product.price * item.product.discount) / 100;
      return {
        product: item.product._id,
        name: item.product.name,
        price: discountedPrice,
        quantity: item.quantity,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentApp,
      razorpayPaymentId,
      total,
    });
    await order.save();

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    cart.items = [];
    await cart.save();

    try {
      const user = await User.findById(req.userId);
      if (user?.email) {
        await sendOrderConfirmationEmail(user.email, order);
        await sendAdminOrderNotification(order, user);
      }
    } catch (emailErr) {
      console.error('Order email failed to send:', emailErr.message);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'fullName email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
