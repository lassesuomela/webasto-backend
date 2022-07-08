let express = require('express');
let router = express.Router();

let otaController = require('../controllers/otaController');
let otpController = require('../controllers/otpController');


router.post('/upload', otpController.verifyToken, otaController.uploadFile);
router.get('/version', otaController.getVersion);

module.exports = router;