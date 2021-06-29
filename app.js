if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const createError = require('http-errors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const api = require('./api');
const helmet = require('./helmet');

mongoose.connect(process.env.DATABASE_URL, {
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
app.use('/static', expressStaticGzip(path.join(__dirname, 'dist'), { enableBrotli: true, index: false }));
app.use(morgan('combined'));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/admin', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist/admin.html'));
});

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
  console.log(`Production server listening on ${port}`);
});
