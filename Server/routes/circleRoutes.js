const express = require('express');
const router = express.Router();
const {
  createCircle,
  getAllCircles,
  getCircleById,
  updateCircle,
  deleteCircle,
  joinCircle,
  getMyCircles,
  getRecommendedCircles,
  getPendingMembers,
  approveMembership,
  rejectMembership
} = require('../controllers/circleController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { uploadDocument } = require('../middleware/upload');
const { createCircleSchema } = require('../validation/circleValidation');

// מסך 5 — גילוי מעגלים
router.get('/', getAllCircles);

// מסך 4 — sidebar שמאל
router.get('/my', protect, getMyCircles);

// מסך 4 — sidebar ימין
router.get('/recommended', protect, getRecommendedCircles);

// קבלת בקשות הצטרפות ממתינות (רק לבעלים)
router.get('/:id/pending', protect, getPendingMembers);

// מסך 6 — דף מעגל ספציפי
router.get('/:id', getCircleById);

// מסך 7 — יצירת מעגל חדש עם מסמך
router.post('/', protect, uploadDocument.single('document'), validate(createCircleSchema), createCircle);

// מסך 5 — כפתור הצטרף
router.post('/:id/join', protect, joinCircle);

// אישור בקשת הצטרפות (רק לבעלים)
router.put('/:circleId/members/:userId/approve', protect, approveMembership);

// דחיית בקשת הצטרפות (רק לבעלים)
router.put('/:circleId/members/:userId/reject', protect, rejectMembership);

// עדכון מעגל
router.put('/:id', protect, uploadDocument.single('document'), updateCircle);

// מחיקת מעגל
router.delete('/:id', protect, deleteCircle);

module.exports = router;