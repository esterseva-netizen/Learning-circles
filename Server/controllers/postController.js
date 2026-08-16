const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Circle = require('../models/circle');
const Membership = require('../models/Membership');

// יצירת פוסט חדש
exports.createPost = async (req, res, next) => {
  try {
    const { content, circle, postType } = req.body;

    const membership = await Membership.findOne({
      user: req.user._id,
      circle: circle,
      status: 'approved'
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'רק חברי המעגל יכולים לפרסם פוסטים'
      });
    }

    // אם הועלה קובץ (PDF/Word) — שומר את הנתיב ואת השם המקורי
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const mediaName = req.file ? req.file.originalname : '';

    const post = await Post.create({
      content,
      mediaUrl,
      mediaName,
      circle,
      postType,
      author: req.user._id
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('circle', 'name');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    next(error);
  }
};

// קבלת פיד — פוסטים מהמעגלים של המשתמש
exports.getFeed = async (req, res, next) => {
  try {
    const memberships = await Membership.find({
      user: req.user._id,
      status: 'approved'
    });

    const circleIds = memberships.map(m => m.circle);

    const posts = await Post.find({ circle: { $in: circleIds } })
      .populate('author', 'name avatar')
      .populate('circle', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

// קבלת פוסטים של מעגל ספציפי
exports.getCirclePosts = async (req, res, next) => {
  try {
    // ✅ תיקון BUG 3 — בדיקה שהמשתמש חבר במעגל לפני חשיפת התוכן
    const membership = await Membership.findOne({
      user: req.user._id,
      circle: req.params.circleId,
      status: 'approved'
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'רק חברי המעגל יכולים לראות פוסטים'
      });
    }

    const posts = await Post.find({ circle: req.params.circleId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

// קבלת פוסט ספציפי
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('circle', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'פוסט לא נמצא'
      });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// עדכון פוסט
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'פוסט לא נמצא'
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק מחבר הפוסט יכול לערוך אותו'
      });
    }

    //  רק שדות מורשים, לא כל req.body
    const { content, postType } = req.body;

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { content, postType, isEdited: true },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// מחיקת פוסט
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'פוסט לא נמצא'
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק מחבר הפוסט יכול למחוק אותו'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    //  מוחק גם את התגובות של הפוסט
    await Comment.deleteMany({ post: req.params.id });

    res.status(200).json({
      success: true,
      message: 'הפוסט נמחק בהצלחה'
    });
  } catch (error) {
    next(error);
  }
};

// לייק על פוסט
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'פוסט לא נמצא'
      });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      await Post.findByIdAndUpdate(req.params.id, {
        $pull: { likes: req.user._id },
        $inc: { likesCount: -1 }
      });
      return res.status(200).json({
        success: true,
        message: 'הלייק הוסר'
      });
    }

    await Post.findByIdAndUpdate(req.params.id, {
      $push: { likes: req.user._id },
      $inc: { likesCount: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'לייק נוסף'
    });
  } catch (error) {
    next(error);
  }
};