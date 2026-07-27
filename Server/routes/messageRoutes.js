const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getCircleMessages,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// קבלת הודעות של מעגל
router.get('/:circleId', protect, getCircleMessages);

// שליחת הודעה במעגל
router.post('/:circleId', protect, sendMessage);

// מחיקת הודעה
router.delete('/:id', protect, deleteMessage);

module.exports = router;