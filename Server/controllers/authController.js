const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'אימייל כבר קיים במערכת' 
      });
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      isNewUser: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'אימייל או סיסמה שגויים' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'אימייל או סיסמה שגויים' 
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      isNewUser: false,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, userType, institution, studyYear, interests, bio } = req.body;

    if (interests && interests.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'ניתן לבחור עד 4 תחומי עניין בלבד'
      });
    }

    // אם הועלתה תמונה — שומר את הנתיב שלה
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = {
      name,
      userType,
      institution,
      studyYear,
      interests,
      bio,
      isProfileComplete: true
    };

    // מוסיף תמונה רק אם הועלתה
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};