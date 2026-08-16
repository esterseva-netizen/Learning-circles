const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'תוכן הפוסט הוא חובה'],
    maxlength: 1000
  },
  mediaUrl: { type: String, default: '' },
  mediaName: { type: String, default: '' },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: { type: Number, default: 0 },

  // ✨ שדות חדשים
  postType: {
    type: String,
    enum: ['question', 'update', 'material', 'general'],
    default: 'general'
  },
  commentsCount: { type: Number, default: 0 },
  isEdited: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);