let express = require('express');
let router = express.Router();

let voltageController = require('../controllers/voltageController');
const cache = require('../configs/cache');

router.get('/voltage', cache.checkCache, voltageController.getVoltage);
router.get('/voltage/hour', cache.checkCache, voltageController.getVoltageLastHour);

router.post('/voltage', voltageController.addVoltage);

module.exports = router;