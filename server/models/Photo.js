const mongoose = require('mongoose');

/**
 * Photo.js
 *
 * Mongoose schema for an uploaded photo. userId references the
 * owning User document, enforced server-side at deletion time.
 */
const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
  },
  fileName: {
    type: String,
    required: [true, 'fileName is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200,
  },
  description: { type: String, trim: true, default: '' },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);
