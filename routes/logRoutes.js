let express = require('express');
let router = express.Router();

let logController = require('../controllers/logController');
const cache = require('../configs/cache');

router.get('/logs', cache.checkCache, logController.fetchLastLog);

router.get('/logs/:page', cache.checkCache, logController.fetchNLog);

router.post('/logs', logController.updateLogs);

module.exports = router;