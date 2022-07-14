let express = require('express');
let router = express.Router();

let statusController = require('../controllers/statusController');
const cache = require('../configs/cache');

router.get('/status/:id', cache.checkCache, statusController.getStatus);

router.post('/status/:id', statusController.modifyStatus);

module.exports = router;