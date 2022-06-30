let express = require('express');
let router = express.Router();

let uptimeController = require('../controllers/uptimeController');

router.get('/uptime', uptimeController.get7);

router.post('/uptime', uptimeController.add);

module.exports = router;