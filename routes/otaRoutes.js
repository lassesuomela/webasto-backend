let express = require('express');
let router = express.Router();

let otaController = require('../controllers/otaController');

router.get('/download', otaController.downloadFile);
router.get('/version', otaController.getVersion);

module.exports = router;