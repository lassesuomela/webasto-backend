let express = require('express');
let router = express.Router();

let uptimeController = require('../controllers/uptimeController');
const cache = require('../configs/cache');

router.get('/uptime', cache.checkCache, uptimeController.get7);

router.post('/uptime', uptimeController.add);

module.exports = router;