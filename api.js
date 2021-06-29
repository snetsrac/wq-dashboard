const express = require('express');
const createError = require('http-errors');
const { parseISO, isValid } = require('date-fns');
const getData = require('./data');
const sites = require('./sites');

const router = express.Router();

const routeHandlerAsync = (routeHandler) => {
  return (req, res, next) => {
    routeHandler(req, res, next).catch(next);
  }
};

router.get('/sites', (req, res, next) => {
  res.json(sites);
});

router.get('/data/:startDate/:endDate', routeHandlerAsync(async (req, res, next) => {
  const dateRange = {
    start: parseISO(req.params.startDate),
    end: parseISO(req.params.endDate)
  };

  if (!isValid(dateRange.start) || !isValid(dateRange.end)) {
    return next(createError(400, 'Dates must be in ISO format.'));
  }

  const data = await getData(dateRange);

  if (data === null) {
    res.sendStatus(204);
  } else {
    res.json(data);
  }
}));

module.exports = router;
