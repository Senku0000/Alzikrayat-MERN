const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Photo = require('../models/Photo');
const User = require('../models/User');

/**
 * commentController.js
 *
 * REST handlers for a photo's nested comment thread:
 * GET/POST /api/photos/:id/comments
 */

/**
 * GET /api/photos/:id/comments
 */
async function getForPhoto(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const comments = await Comment.find({ photoId: id })
      .sort({ dateTime: 1 })
      .populate('userId', 'firstName lastName');

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/photos/:id/comments
 * Body: { userId, comment }
 */
async function create(req, res, next) {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const [photo, user] = await Promise.all([Photo.findById(id), User.findById(userId)]);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newComment = await Comment.create({ photoId: id, userId, comment });
    const populated = await newComment.populate('userId', 'firstName lastName');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

module.exports = { getForPhoto, create };
