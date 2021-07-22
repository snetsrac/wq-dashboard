const express = require('express');

const controller = require('../controllers/sites');
const routeHandlerAsync = require('../middleware/routeHandlerAsync');

const router = express.Router();

router.get('/', routeHandlerAsync(controller.getSites));

module.exports = router;
