let express = require('express');
let router = express.Router();

let logController = require('../controllers/logController');

router.get('/logs', logController.fetchLastLog);

router.get('/logs/:page', logController.fetchNLog);

router.post('/logs', logController.updateLogs);

module.exports = router;