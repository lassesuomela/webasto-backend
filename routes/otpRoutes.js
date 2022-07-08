let express = require('express');
let router = express.Router();

let otpController = require('../controllers/otpController');

router.post('/secret', otpController.createSecret);
router.post('/secret/remove', otpController.deleteSecret);
router.get('/token', otpController.createOTPCode);

module.exports = router;
