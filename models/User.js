const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  resetOtp: { type: String },
  resetOtpExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
