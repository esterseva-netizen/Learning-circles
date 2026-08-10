const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getCircleMessages,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { sendMessageSchema } = require('../validation/messageValidation');

// קבלת הודעות של מעגל
router.get('/:circleId', protect, getCircleMessages);

// שליחת הודעה במעגל
router.post('/:circleId', protect, validate(sendMessageSchema), sendMessage);

// מחיקת הודעה
router.delete('/:id', protect, deleteMessage);

module.exports = router;