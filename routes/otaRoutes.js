let express = require('express');
let router = express.Router();

let otaController = require('../controllers/otaController');
const cache = require('../configs/cache');

router.post('/upload', otaController.uploadFile);
router.get('/version', cache.checkCache, otaController.getVersion);

module.exports = router;