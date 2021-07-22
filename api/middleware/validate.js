const createError = require('http-errors');
const Joi = require('joi');
const { parseISO, formatISO, isBefore, isFuture, startOfToday, subMonths } = require('date-fns');

const validateDate = (value, helpers) => {
  if (value !== undefined && isFuture(parseISO(value))) {
    return helpers.error('date.inFuture');
  }
  
  return value;
};

const validateDateQuery = (value, helpers) => {
  const to = value.to ? parseISO(value.to) : startOfToday();
  const from = value.from ? parseISO(value.from) : subMonths(to, 1);

  if (isBefore(to, from)) return helpers.error('date.fromBeforeTo');

  value.from = formatISO(from, { representation: 'date' });
  value.to = formatISO(to, { representation: 'date' });
  return value;
};

const dateQuery = Joi.object().keys({
  from: Joi.string()
    .isoDate()
    .custom(validateDate)
    .messages({ 'date.inFuture': '"From" date must not be in the future'}),
  to: Joi.string()
    .isoDate()
    .custom(validateDate)
    .messages({ 'date.inFuture': '"To" date must not be in the future' })
}).custom(validateDateQuery)
  .messages({
    'dateQuery.fromBeforeTo': '"To" date must not be earlier than "From" date'
  });

const hydroGetRequest = Joi.object({
  params: Joi.object({
    dbkeys: Joi.string()
      .pattern(/^(?:\d{1,5}|[A-Za-z][A-Za-z0-9]\d{3})(?:,\d{1,5}|,[A-Za-z][A-Za-z0-9]\d{3})*$/)
      .required()
      .messages({
        'any.required': 'No dbkeys were provided',
        'string.pattern.base': 'Dbkeys must be a one to five digit number or of the forms A1234 or AB1234; if multiple dbkeys are provided, they must be comma-separated'
      })
  }).required(),
  query: dateQuery
});

const ermSondeGetRequest = Joi.object({
  params: Joi.object({
    name: Joi.string()
      .required()
      .messages({ 'any.required': 'No sonde name was provided' })
  }).required(),
  query: dateQuery
});

const ermSondePostRequest = Joi.object({
  params: Joi.object({
    name: Joi.string()
      .required()
      .messages({
        'any.required': 'No sonde name was provided'
      })
  }).required(),
  body: Joi.object({
    data: Joi.array().items({
      date: Joi.string()
        .isoDate()
        .required()
        .custom(validateDate)
        .messages({
          'date.isFuture': 'Data must not include entries with dates in the future'
        }),
      salinity: Joi.number().allow(null).min(0).required()
    }).required()
  }).required()
});

exports.getHydro = (req, res, next) => {
  const { params, query } = req;

  const { value, error } = hydroGetRequest.validate({ params, query: query || {} });
  if (error) throw createError(400, error.details[0].message);

  req.params = value.params;
  req.query = value.query;
  next();
};

exports.getErmSonde = (req, res, next) => {
  const { params, query } = req;

  const { value, error } = ermSondeGetRequest.validate({ params, query: query || {} });
  if (error) {
    throw createError(400, error.details[0].message);
  }

  req.params = value.params;
  req.query = value.query;
  next();
};

exports.postErmSonde = (req, res, next) => {
  next();
};
