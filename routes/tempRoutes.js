let express = require('express');
let router = express.Router();

let tempController = require('../controllers/tempController');
const cache = require('../configs/cache');

router.get('/temp', cache.checkCache, tempController.getTemperature);

router.get('/temp/hour', cache.checkCache, tempController.getLastHour);

router.post('/temp', tempController.addTemperature);

module.exports = router;