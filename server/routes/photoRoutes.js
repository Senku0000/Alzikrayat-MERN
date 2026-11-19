const express = require('express');
const router = express.Router();

const photoController = require('../controllers/photoController');
const commentController = require('../controllers/commentController');
const upload = require('../middleware/upload');
const {
  validate,
  createPhotoSchema,
  deletePhotoSchema,
  createCommentSchema,
} = require('../middleware/validation');

// GET /api/photos
router.get('/', photoController.getAll);

// GET /api/photos/:id
router.get('/:id', photoController.getOne);

// POST /api/photos  (multipart/form-data: title, description, userId, photo file)
router.post('/', upload.single('photo'), validate(createPhotoSchema), photoController.create);

// DELETE /api/photos/:id  (body: { userId })
router.delete('/:id', validate(deletePhotoSchema), photoController.remove);

// GET /api/photos/:id/comments
router.get('/:id/comments', commentController.getForPhoto);

// POST /api/photos/:id/comments  (body: { userId, comment })
router.post('/:id/comments', validate(createCommentSchema), commentController.create);

module.exports = router;
