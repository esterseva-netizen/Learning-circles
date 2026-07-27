const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'תוכן התגובה הוא חובה'],
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },

  // ✨ שדה חדש
  isEdited: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);