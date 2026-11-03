const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all customers (non-admin users)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Block / unblock a customer
router.put('/:id/block', authMiddleware, async (req, res) => {
  try {
    const { blocked } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { blocked }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a customer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
