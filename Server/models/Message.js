const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'תוכן ההודעה הוא חובה'],
    maxlength: 1000
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  isEdited: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);