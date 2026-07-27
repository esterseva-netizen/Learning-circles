const Message = require('../models/Message');
const Membership = require('../models/Membership');

// שליחת הודעה במעגל
exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const circleId = req.params.circleId;

    // בדיקה שהמשתמש חבר במעגל
    const membership = await Membership.findOne({
      user: req.user._id,
      circle: circleId,
      status: 'approved'
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'רק חברי המעגל יכולים לשלוח הודעות'
      });
    }

    const message = await Message.create({
      content,
      sender: req.user._id,
      circle: circleId
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    next(error);
  }
};

// קבלת הודעות של מעגל
exports.getCircleMessages = async (req, res, next) => {
  try {
    const circleId = req.params.circleId;

    // בדיקה שהמשתמש חבר במעגל
    const membership = await Membership.findOne({
      user: req.user._id,
      circle: circleId,
      status: 'approved'
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'רק חברי המעגל יכולים לראות הודעות'
      });
    }

    const messages = await Message.find({ circle: circleId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// מחיקת הודעה
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'הודעה לא נמצאה'
      });
    }

    // רק השולח יכול למחוק
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'רק שולח ההודעה יכול למחוק אותה'
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'ההודעה נמחקה בהצלחה'
    });
  } catch (error) {
    next(error);
  }
};