const Circle = require('../models/circle');
const Membership = require('../models/Membership');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Message = require('../models/Message');

// יצירת מעגל חדש
exports.createCircle = async (req, res, next) => {
  try {
    const { name, description, category, customCategory, tags, isPrivate, maxMembers, studyFields } = req.body;

    // אם בחר other חייב למלא customCategory
    if (category === 'other' && !customCategory) {
      return res.status(400).json({
        success: false,
        message: 'נא למלא את שם הקטגוריה'
      });
    }

    const circle = await Circle.create({
      name,
      description,
      category,
      customCategory,
      tags,
      isPrivate,
      maxMembers,
      studyFields,
      owner: req.user._id
    });

    // יוצר את הבעלים כחבר אדמין אוטומטית
    await Membership.create({
      user: req.user._id,
      circle: circle._id,
      role: 'admin',
      status: 'approved'
    });

    res.status(201).json({ success: true, data: circle });
  } catch (error) {
    next(error);
  }
};

// קבלת כל המעגלים עם חיפוש
exports.getAllCircles = async (req, res, next) => {
  try {
    const { search, category, isPrivate } = req.query;

    let filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (isPrivate !== undefined) {
      filter.isPrivate = isPrivate === 'true';
    }

    const circles = await Circle.find(filter)
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: circles });
  } catch (error) {
    next(error);
  }
};

// קבלת מעגל ספציפי
exports.getCircleById = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.id)
      .populate('owner', 'name avatar');

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'מעגל לא נמצא'
      });
    }

    res.status(200).json({ success: true, data: circle });
  } catch (error) {
    next(error);
  }
};

// עדכון מעגל
exports.updateCircle = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'מעגל לא נמצא'
      });
    }

    if (circle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק בעל המעגל יכול לעדכן אותו'
      });
    }

    const updated = await Circle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// מחיקת מעגל
exports.deleteCircle = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'מעגל לא נמצא'
      });
    }

    if (circle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק בעל המעגל יכול למחוק אותו'
      });
    }

    await Circle.findByIdAndDelete(req.params.id);
    await Membership.deleteMany({ circle: req.params.id });

    //  ניקוי כל הנתונים הקשורים למעגל
    const posts = await Post.find({ circle: req.params.id });
    const postIds = posts.map(p => p._id);

    await Comment.deleteMany({ post: { $in: postIds } });
    await Post.deleteMany({ circle: req.params.id });
    await Message.deleteMany({ circle: req.params.id });

    res.status(200).json({
      success: true,
      message: 'המעגל נמחק בהצלחה'
    });
  } catch (error) {
    next(error);
  }
};

// הצטרפות למעגל
exports.joinCircle = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'מעגל לא נמצא'
      });
    }

    const existingMembership = await Membership.findOne({
      user: req.user._id,
      circle: req.params.id
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'כבר חבר במעגל זה'
      });
    }

    if (circle.membersCount >= circle.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'המעגל מלא'
      });
    }

    const status = circle.isPrivate ? 'pending' : 'approved';

    await Membership.create({
      user: req.user._id,
      circle: req.params.id,
      role: 'member',
      status
    });

    if (status === 'approved') {
      await Circle.findByIdAndUpdate(req.params.id, {
        $inc: { membersCount: 1 }
      });
    }

    res.status(200).json({
      success: true,
      message: status === 'pending' ? 'בקשתך נשלחה לאישור' : 'הצטרפת למעגל בהצלחה'
    });
  } catch (error) {
    next(error);
  }
};

// קבלת המעגלים של המשתמש המחובר
exports.getMyCircles = async (req, res, next) => {
  try {
    const memberships = await Membership.find({
      user: req.user._id,
      status: 'approved'
    }).populate('circle');

    const circles = memberships.map(m => m.circle);

    res.status(200).json({ success: true, data: circles });
  } catch (error) {
    next(error);
  }
};

// קבלת מעגלים מומלצים
exports.getRecommendedCircles = async (req, res, next) => {
  try {
    const user = req.user;

    const circles = await Circle.find({
      isActive: true,
      studyFields: { $in: user.interests }
    })
      .populate('owner', 'name avatar')
      .limit(5);

    res.status(200).json({ success: true, data: circles });
  } catch (error) {
    next(error);
  }
};

// קבלת בקשות הצטרפות ממתינות
exports.getPendingMembers = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.id);

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'מעגל לא נמצא'
      });
    }

    if (circle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק בעל המעגל יכול לצפות בבקשות'
      });
    }

    const pending = await Membership.find({
      circle: req.params.id,
      status: 'pending'
    }).populate('user', 'name avatar email');

    res.status(200).json({ success: true, data: pending });
  } catch (error) {
    next(error);
  }
};

// אישור בקשת הצטרפות
exports.approveMembership = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.circleId);

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'מעגל לא נמצא'
      });
    }

    if (circle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק בעל המעגל יכול לאשר חברים'
      });
    }

    const membership = await Membership.findOne({
      user: req.params.userId,
      circle: req.params.circleId,
      status: 'pending'
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'בקשת הצטרפות לא נמצאה'
      });
    }

    membership.status = 'approved';
    await membership.save();

    await Circle.findByIdAndUpdate(req.params.circleId, {
      $inc: { membersCount: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'החבר אושר בהצלחה'
    });
  } catch (error) {
    next(error);
  }
};

// דחיית בקשת הצטרפות
exports.rejectMembership = async (req, res, next) => {
  try {
    const circle = await Circle.findById(req.params.circleId);

    if (!circle) {
      return res.status(404).json({
        success: false,
        message: 'מעגל לא נמצא'
      });
    }

    if (circle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק בעל המעגל יכול לדחות בקשות'
      });
    }

    const membership = await Membership.findOne({
      user: req.params.userId,
      circle: req.params.circleId,
      status: 'pending'
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'בקשת הצטרפות לא נמצאה'
      });
    }

    await Membership.findByIdAndDelete(membership._id);

    res.status(200).json({
      success: true,
      message: 'הבקשה נדחתה'
    });
  } catch (error) {
    next(error);
  }
};