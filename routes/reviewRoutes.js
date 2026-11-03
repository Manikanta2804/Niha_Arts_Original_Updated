const express = require('express');
const Review = require('../models/Review');
const Order = require('../models/Order');
require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'fullName')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:productId/eligibility', authMiddleware, async (req, res) => {
  try {
    const deliveredOrder = await Order.findOne({
      user: req.userId,
      status: 'Delivered',
      'items.product': req.params.productId,
    });
    res.json({ eligible: !!deliveredOrder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, rating, comment, images } = req.body;

    const deliveredOrder = await Order.findOne({
      user: req.userId,
      status: 'Delivered',
      'items.product': productId,
    });
    if (!deliveredOrder) {
      return res.status(403).json({ message: 'You can only review products you have purchased and received' });
    }

    const review = new Review({ product: productId, user: req.userId, rating, comment, images: images || [] });
    await review.save();
    await review.populate('user', 'fullName');
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
