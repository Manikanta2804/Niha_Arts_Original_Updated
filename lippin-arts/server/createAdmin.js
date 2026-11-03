require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function run() {
  if (!process.env.ADMIN_PASSWORD) {
    console.error('Set ADMIN_PASSWORD in .env before running this script');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ username: 'niharika_b' });
  if (existing) {
    await User.deleteOne({ username: 'niharika_b' });
    console.log('Removed existing account');
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  const admin = new User({
    fullName: 'Niharika',
    email: 'niharika_b@lippinarts.local',
    username: 'niharika_b',
    phone: '0000000000',
    password: hashedPassword,
    isAdmin: true,
  });

  await admin.save();
  console.log('Admin account created:', admin.username);
  process.exit(0);
}

run();
