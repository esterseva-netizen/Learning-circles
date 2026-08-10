const Joi = require('joi');

exports.createCommentSchema = Joi.object({
  content: Joi.string().max(500).required().messages({
    'string.max': 'תוכן התגובה לא יכול לעלות על 500 תווים',
    'any.required': 'תוכן התגובה הוא שדה חובה'
  })
});

exports.updateCommentSchema = Joi.object({
  content: Joi.string().max(500).required().messages({
    'string.max': 'תוכן התגובה לא יכול לעלות על 500 תווים',
    'any.required': 'תוכן התגובה הוא שדה חובה'
  })
});