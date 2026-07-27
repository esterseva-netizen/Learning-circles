const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { uploadAvatar } = require('../middleware/upload');
const { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema 
} = require('../validation/authValidation');

// מסך 2 — הרשמה והתחברות
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// קבלת פרטי המשתמש המחובר
router.get('/me', protect, getMe);

// מסך 3 — בניית פרופיל עם תמונה
router.put('/update-profile', protect, uploadAvatar.single('avatar'), validate(updateProfileSchema), updateProfile);

module.exports = router;