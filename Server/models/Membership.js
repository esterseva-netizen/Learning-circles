const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  circle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Circle',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

membershipSchema.index(
  { user: 1, circle: 1 },
  { unique: true }
);

module.exports = mongoose.model('Membership', membershipSchema);