const createError = require('http-errors');
const Joi = require('joi');
const { parseISO, formatISO, isBefore, isFuture, startOfToday, subMonths } = require('date-fns');

const hydroRequest = Joi.object({
  params: Joi.object({
    dbkeys: Joi.string()
      .pattern(/^(?:\d{1,5}|[A-Za-z][A-Za-z0-9]\d{3})(?:,\d{1,5}|,[A-Za-z][A-Za-z0-9]\d{3})*$/)
      .required()
      .messages({
        'any.required': 'No dbkeys were provided',
        'string.pattern.base': 'Dbkeys must be a one to five digit number or of the forms A1234 or AB1234; if multiple dbkeys are provided, they must be comma-separated'
      })
  }).required(),
  query: Joi.object().keys({
    from: Joi.string().isoDate(),
    to: Joi.string().isoDate()
  })
});

const ermSondesRequest = Joi.object({
  params: Joi.object({
    name: Joi.string()
      .allow('johns-island', 'munyon-island')
      .required()
      .messages({
        'any.required': 'No sonde name was provided'
      })
  }).required(),
  query: Joi.object().keys({
    from: Joi.string().isoDate(),
    to: Joi.string().isoDate()
  })
});

const validateDates = (query) => {
  let from = query?.from ? parseISO(query.from) : null;
  let to = query?.to ? parseISO(query.to) : null;

  let dateError;
  if (to && isFuture(to)) dateError = '"To" date must not be in the future';
  if (from && isFuture(from)) dateError = '"From" date must not be in the future';
  if (from && to && isBefore(to, from)) dateError = '"From" date must not be later than "to" date';

  if (!to) to = startOfToday();
  if (!from) from = subMonths(to, 1);
  
  const normalizedQuery = {
    from: formatISO(from, { representation: 'date'}),
    to: formatISO(to, { representation: 'date'})
  };

  return {
    dateError,
    normalizedQuery
  };
};

module.exports = (schema) => (req, res, next) => {
  const { params, query } = req;
  let error;

  switch (schema) {
    case 'hydro':
      error = hydroRequest.validate({ params, query }).error;
      break;
    case 'ermSondes':
      error = ermSondesRequest.validate({ params, query }).error;
      break;
    default:
      throw new Error(`Validation schema ${schema} not recognized.`);
      break;
  }

  if (error) throw createError(400, error.details[0].message);

  const { dateError, normalizedQuery } = validateDates(query);
  if (dateError) throw createError(400, dateError);
  req.query = normalizedQuery;

  next();
};
