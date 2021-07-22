const path = require('path');
const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');
const helmet = require('./utils/helmet');

const app = express();

app.use(helmet);
app.use(morgan('combined'));

app.use('/sites', routes.sites);
app.use('/hydro', routes.hydro);
app.use('/erm-sondes', routes.ermSondes)

app.all('*', (req, res, next) => {
  throw createError(404);
});

app.use(errorHandler);

module.exports = app;
