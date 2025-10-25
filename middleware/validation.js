const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(e => ({ field: e.param, msg: e.msg }));
    return res.status(400).json({ error: 'Validation failed', details: formatted });
  }
  next();
}

module.exports = { handleValidationErrors };
