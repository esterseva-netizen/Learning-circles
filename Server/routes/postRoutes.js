const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getCirclePosts,
  getPostById,
  updatePost,
  deletePost,
  likePost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { uploadDocument } = require('../middleware/upload');
const { createPostSchema } = require('../validation/postValidation');

// מסך 4 — פיד ראשי
router.get('/feed', protect, getFeed);

// פוסטים של מעגל ספציפי
router.get('/circle/:circleId', protect, getCirclePosts);

// פוסט ספציפי
router.get('/:id', protect, getPostById);

// יצירת פוסט חדש עם מסמך
router.post('/', protect, uploadDocument.single('document'), validate(createPostSchema), createPost);

// עדכון פוסט
router.put('/:id', protect, uploadDocument.single('document'), updatePost);

// מחיקת פוסט
router.delete('/:id', protect, deletePost);

// לייק על פוסט
router.post('/:id/like', protect, likePost);

module.exports = router;