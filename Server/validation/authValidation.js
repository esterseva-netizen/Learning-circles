const Joi = require('joi');

// validation להרשמה
exports.registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'השם חייב להכיל לפחות 2 תווים',
      'string.max': 'השם לא יכול לעלות על 50 תווים',
      'any.required': 'שם הוא שדה חובה'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'פורמט אימייל לא תקין',
      'any.required': 'אימייל הוא שדה חובה'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'הסיסמה חייבת להכיל לפחות 8 תווים',
      'string.pattern.base': 'הסיסמה חייבת להכיל אות ומספר',
      'any.required': 'סיסמה היא שדה חובה'
    })
});

// validation להתחברות
exports.loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'פורמט אימייל לא תקין',
      'any.required': 'אימייל הוא שדה חובה'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'סיסמה היא שדה חובה'
    })
});

// validation לעדכון פרופיל
exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'השם חייב להכיל לפחות 2 תווים',
    'string.max': 'השם לא יכול לעלות על 50 תווים'
  }),
  userType: Joi.string()
    .valid('highschool', 'student', 'independent'),
  institution: Joi.string().max(100).allow(''),
  studyYear: Joi.string().allow(''),
  interests: Joi.array().max(4).messages({
    'array.max': 'ניתן לבחור עד 4 תחומי עניין'
  }),
  bio: Joi.string().max(200).allow('')
});