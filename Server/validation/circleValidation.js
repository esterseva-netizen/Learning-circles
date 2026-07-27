const Joi = require('joi');

exports.createCircleSchema = Joi.object({
  name: Joi.string().min(2).max(60).required().messages({
    'string.min': 'שם המעגל חייב להכיל לפחות 2 תווים',
    'string.max': 'שם המעגל לא יכול לעלות על 60 תווים',
    'any.required': 'שם המעגל הוא שדה חובה'
  }),
  description: Joi.string().max(500).allow(''),
  category: Joi.string().valid(
    'mathematics', 'programming', 'physics',
    'biology', 'economics', 'languages',
    'history', 'literature', 'art', 'music',
    'psychology', 'law', 'medicine',
    'engineering', 'geography', 'physical_education', 'other'
  ).required().messages({
    'any.required': 'קטגוריה היא שדה חובה'
  }),
  customCategory: Joi.string().max(50).allow(''),
  tags: Joi.array().items(Joi.string()),
  isPrivate: Joi.boolean(),
  maxMembers: Joi.number().min(2).max(200),
  studyFields: Joi.array().items(Joi.string())
});