const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages.join('; '),
        details: messages,
      });
    }
    next(error);
  }
};

module.exports = validate;
