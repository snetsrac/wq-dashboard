const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const config = require('../../webpack.dev.config.js')
const compiler = webpack(config);
const api = require('./api');
const helmet = require('./helmet');

mongoose.connect('mongodb://localhost:27017/wq-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', () => { console.log(`Connected to database: ${db.host}:${db.port}/${db.name}`); });

const app = express();

app.use(helmet);
app.use(devMiddleware(compiler));
app.use(hotMiddleware(compiler));

app.use('/api', api);

app.all('*', (req, res, next) => {
  res.redirect('/');
});

app.use((err, req, res, next) => {
  if (createError.isHttpError(err)) {
    res.status(err.statusCode);
    res.send(`Error: ${err.message}`);
  } else {
    console.error(err.stack || err.message);
    res.status(500);
    res.send('An unexpected error occurred.');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Development server listening on ${port}`);
});
