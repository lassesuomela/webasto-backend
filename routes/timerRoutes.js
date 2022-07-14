let express = require('express');
let router = express.Router();

let timerController = require('../controllers/timerController');
const cache = require('../configs/cache');

router.get('/timers', cache.checkCache, timerController.getCurrentDaysTimer);
router.get('/timers/all', cache.checkCache, timerController.displayAllTimers);

router.post('/timers', timerController.modifyTimers);

module.exports = router;