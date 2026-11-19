const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const User = require('../models/User');

/**
 * photoController.js
 *
 * REST handlers for the /api/photos resource: listing, single-photo
 * lookup, upload (file + metadata), and ownership-checked deletion.
 */

/**
 * GET /api/photos
 */
async function getAll(req, res, next) {
  try {
    const photos = await Photo.find()
      .sort({ dateTime: -1 })
      .populate('userId', 'firstName lastName');
    res.status(200).json(photos);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/photos/:id
 */
async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const photo = await Photo.findById(id).populate('userId', 'firstName lastName');
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.status(200).json(photo);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/photos
 * Expects multipart/form-data: fields { title, description, userId }
 * and a single file field named "photo" (handled by multer upstream).
 */
async function create(req, res, next) {
  try {
    const { title, description, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'An image file is required' });
    }

    const owner = await User.findById(userId);
    if (!owner) {
      // Clean up the file we already saved to disk before rejecting
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: 'Owner user not found' });
    }

    const photo = await Photo.create({
      userId,
      fileName: req.file.filename,
      title,
      description,
    });

    const populated = await photo.populate('userId', 'firstName lastName');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/photos/:id
 * Expects { userId } in the request body — only the owner may delete.
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.query.userId;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'userId is required to delete a photo' });
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own photos' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', photo.fileName);
    fs.unlink(filePath, () => {}); // ignore if already missing

    await photo.deleteOne();

    res.status(200).json({ message: 'Photo deleted', id });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, remove };
