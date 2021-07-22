const createError = require('http-errors');

const logger = require('./logger');

module.exports = (err, req, res, next) => {
  if (createError.isHttpError(err)) {
    res.status(err.statusCode);
    res.json({ error: { code: err.statusCode, message: err.message } });
  } else {
    logger.error(err);
    res.status(500);
    res.json({ error: { code: 500, message: 'An unexpected error occurred.' } });
  }
};
