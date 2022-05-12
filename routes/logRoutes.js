let express = require('express');
let router = express.Router();

let logController = require('../controllers/logController');

router.get('/logs', logController.fetchLastLog);

router.post('/logs', logController.updateLogs);

module.exports = router;