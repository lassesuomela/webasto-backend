let express = require('express');
let router = express.Router();

let voltageController = require('../controllers/voltageController');

router.get('/voltage', voltageController.getVoltage);
router.get('/voltage/hour', voltageController.getVoltageLastHour);

router.post('/voltage', voltageController.addVoltage);

module.exports = router;