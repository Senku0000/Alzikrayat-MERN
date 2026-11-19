const mongoose = require('mongoose');

/**
 * Comment.js
 *
 * Mongoose schema for a single comment on a photo.
 */
const commentSchema = new mongoose.Schema({
  photoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: [true, 'photoId is required'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
  },
  comment: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
  },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
