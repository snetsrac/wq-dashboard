const express = require('express');

const routeHandlerAsync = require('../middleware/routeHandlerAsync');
const validate = require('../middleware/validate');
const controller = require('../controllers/hydro');

const router = express.Router();

router.get('/:dbkeys', validate('hydro'), routeHandlerAsync(controller.getHydro));
router.get('/', validate('hydro'), routeHandlerAsync(controller.getHydro));

module.exports = router;
