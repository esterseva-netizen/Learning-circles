const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם מעגל הוא חובה'],
    trim: true,
    minlength: 2,
    maxlength: 60
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  cover: { type: String, default: '' },
  category: {
    type: String,
    enum: [
      'mathematics',
      'programming',
      'physics',
      'biology',
      'economics',
      'languages',
      'history',
      'literature',
      'art',
      'music',
      'psychology',
      'law',
      'medicine',
      'engineering',
      'geography',
      'physical_education',
      'other'
    ],
    required: true
  },
  customCategory: {
    type: String,
    maxlength: 50,
    default: ''
  },
  tags: [{ type: String, trim: true }],
  isPrivate: { type: Boolean, default: false },
  maxMembers: { type: Number, default: 50, min: 2, max: 200 },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  membersCount: { type: Number, default: 1 },
  studyFields: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true }

}, { timestamps: true });

circleSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Circle', circleSchema);