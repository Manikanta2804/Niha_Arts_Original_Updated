require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Lippin Arts backend!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

const mongoUri = process.env.MONGO_URI;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!mongoUri) {
    console.warn('MONGO_URI is missing from environment. MongoDB connection will fail.');
  }
});

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err.message));
}
