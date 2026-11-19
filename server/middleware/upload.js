const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

/**
 * upload.js
 *
 * Multer configuration for photo uploads: stores files on disk under
 * server/uploads/ with a collision-safe generated name, and rejects
 * anything that isn't a common image MIME type.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `photo_${Date.now()}_${uniqueSuffix}${ext}`);
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error('Only JPEG, PNG, GIF, or WEBP images are allowed');
    err.status = 400;
    cb(err);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

module.exports = upload;
