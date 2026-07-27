const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'שם הוא שדה חובה'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'אימייל הוא שדה חובה'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'פורמט אימייל לא תקין']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
    validate: {
      validator: function(value) {
        return /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(value);
      },
      message: 'הסיסמה חייבת להכיל לפחות אות אחת ומספר אחד'
    }
  },
  avatar: { type: String, default: '' },
  bio: { type: String, maxlength: 200, default: '' },
  institution: { type: String, default: '' },
  interests: [{ type: String }],

  userType: {
    type: String,
    enum: ['highschool', 'student', 'independent'],
    default: 'student'
  },
  studyYear: {
    type: String,
    default: ''
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);