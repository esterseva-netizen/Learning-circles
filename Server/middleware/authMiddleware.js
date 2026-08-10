const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'לא מורשה — נא להתחבר' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    // ✅ תיקון BUG 7 — אם המשתמש נמחק מהמסד, עוצרים כאן ולא ממשיכים
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'המשתמש אינו קיים עוד'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token לא תקין או פג תוקף' 
    });
  }
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'אין לך הרשאה לפעולה זו' 
    });
  }
  next();
};