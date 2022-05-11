let express = require('express');
let router = express.Router();

let timerController = require('../controllers/timerController');

router.get('/timers', timerController.getCurrentDaysTimer);

router.post('/timers', timerController.modifyTimers);

module.exports = router;