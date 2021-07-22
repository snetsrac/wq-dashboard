const express = require('express');

const routeHandlerAsync = require('../middleware/routeHandlerAsync');
const validate = require('../middleware/validate');
const controller = require('../controllers/ermSondes');

const router = express.Router();

router.get('/:name', validate.getErmSonde, routeHandlerAsync(controller.getErmSonde));
router.get('/', validate.getErmSonde, routeHandlerAsync(controller.getErmSonde));

router.post('/:name', validate.postErmSonde, routeHandlerAsync(controller.postErmSonde));

module.exports = router;
