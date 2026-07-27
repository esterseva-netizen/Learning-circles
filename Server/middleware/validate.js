const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,    // מראה את כל השגיאות בבת אחת
      stripUnknown: true    // מסיר שדות לא מוכרים
    });

    if (error) {
      const errorMessages = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        message: 'שגיאת validation',
        errors: errorMessages
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;