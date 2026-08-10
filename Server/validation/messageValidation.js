const Joi = require('joi');

exports.sendMessageSchema = Joi.object({
  content: Joi.string().max(1000).required().messages({
    'string.max': 'תוכן ההודעה לא יכול לעלות על 1000 תווים',
    'any.required': 'תוכן ההודעה הוא שדה חובה'
  })
});