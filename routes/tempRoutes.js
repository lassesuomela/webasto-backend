let express = require('express');
let router = express.Router();

let tempController = require('../controllers/tempController');

router.get('/temp', tempController.getTemperature);

router.get('/temp/hour', tempController.getLastHour);

router.post('/temp', tempController.addTemperature);

module.exports = router;