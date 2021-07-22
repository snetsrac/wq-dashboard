const express = require('express');

const routeHandlerAsync = require('../middleware/routeHandlerAsync');
const validate = require('../middleware/validate');
const controller = require('../controllers/ermSondes');

const router = express.Router();

router.get('/:name', validate('ermSondes'), routeHandlerAsync(controller.getErmSonde));
router.get('/', validate('ermSondes'), routeHandlerAsync(controller.getErmSonde));

module.exports = router;
