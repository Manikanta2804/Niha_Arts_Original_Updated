const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Cloudinary: keep files in memory then stream to Cloudinary.
// Local fallback (no Cloudinary keys): save to ./uploads like before.
const uploadsDir = path.join(__dirname, '../uploads');
if (!useCloudinary) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
      },
    });

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Returns a URL for an uploaded file (full https URL on Cloudinary, /uploads/... locally)
const saveFile = (file) =>
  new Promise((resolve, reject) => {
    if (!useCloudinary) return resolve(`/uploads/${file.filename}`);
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'niharts' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });

module.exports = upload;
module.exports.saveFile = saveFile;
