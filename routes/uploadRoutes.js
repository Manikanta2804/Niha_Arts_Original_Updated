const express = require('express');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.post('/multiple', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
