const http = require('http');

const app = require('./app.js');
const logger = require('./utils/logger');

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  logger.log(`Server listening on ${port}`)
});
