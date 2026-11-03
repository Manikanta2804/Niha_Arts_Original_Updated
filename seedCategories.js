require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const categories = [
  'Embroidery Hoops',
  'Lippan Art',
  'Pipe Cleaner Bouquets',
  'Keychains',
  'Flower Pots',
  'Hairbands',
  'Clutches',
  'Dancing Flowers',
  'Fridge Magnets',
];

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const name of categories) {
    const slug = slugify(name);
    const existing = await Category.findOne({ slug });
    if (!existing) {
      await Category.create({ name, slug });
      console.log(`Created category: ${name}`);
    } else {
      console.log(`Already exists: ${name}`);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed();
