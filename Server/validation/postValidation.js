const Joi = require('joi');

exports.createPostSchema = Joi.object({
  content: Joi.string().max(1000).required().messages({
    'string.max': 'תוכן הפוסט לא יכול לעלות על 1000 תווים',
    'any.required': 'תוכן הפוסט הוא שדה חובה'
  }),
  mediaUrl: Joi.string().allow(''),
  circle: Joi.string().required().messages({
    'any.required': 'יש לבחור מעגל'
  }),
  postType: Joi.string()
    .valid('question', 'update', 'material', 'general')
    .default('general')
});

exports.createCommentSchema = Joi.object({
  content: Joi.string().max(500).required().messages({
    'string.max': 'תוכן התגובה לא יכול לעלות על 500 תווים',
    'any.required': 'תוכן התגובה הוא שדה חובה'
  })
});