let express = require('express');
let router = express.Router();

let otaController = require('../controllers/otaController');

router.post('/upload', otaController.uploadFile);
router.get('/version', otaController.getVersion);

module.exports = router;