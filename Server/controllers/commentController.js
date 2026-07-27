const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Membership = require('../models/Membership');

// יצירת תגובה חדשה
exports.createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    // בדיקה שהפוסט קיים
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'פוסט לא נמצא'
      });
    }

    // בדיקה שהמגיב חבר במעגל שהפוסט שייך אליו
    const membership = await Membership.findOne({
      user: req.user._id,
      circle: post.circle,
      status: 'approved'
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'רק חברי המעגל יכולים להגיב'
      });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 }
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name avatar');

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    next(error);
  }
};

// קבלת כל התגובות של פוסט
exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

// עדכון תגובה
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'תגובה לא נמצאה'
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק מחבר התגובה יכול לערוך אותה'
      });
    }

    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content, isEdited: true },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// מחיקת תגובה
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'תגובה לא נמצאה'
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק מחבר התגובה יכול למחוק אותה'
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'התגובה נמחקה בהצלחה'
    });
  } catch (error) {
    next(error);
  }
};