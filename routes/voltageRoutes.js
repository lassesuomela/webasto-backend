let express = require('express');
let router = express.Router();

let voltageController = require('../controllers/voltageController');

router.get('/voltage', voltageController.getVoltage);

router.post('/voltage', voltageController.updateVoltage);

module.exports = router;