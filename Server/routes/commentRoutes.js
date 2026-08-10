const express = require('express');
const router = express.Router();
const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createCommentSchema, updateCommentSchema } = require('../validation/commentValidation');

// קבלת כל התגובות של פוסט
router.get('/:postId', protect, getPostComments);

// יצירת תגובה חדשה
router.post('/:postId', protect, validate(createCommentSchema), createComment);

// עדכון תגובה
router.put('/:id', protect, validate(updateCommentSchema), updateComment);

// מחיקת תגובה
router.delete('/:id', protect, deleteComment);

module.exports = router;