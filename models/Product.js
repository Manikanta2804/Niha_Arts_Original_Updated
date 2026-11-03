const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  materials: { type: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
