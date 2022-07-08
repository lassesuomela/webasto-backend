let express = require('express');
let router = express.Router();

let otpController = require('../controllers/otpController');

router.post('/secret', otpController.createSecret);
router.delete('/secret', otpController.createSecret);
router.get('/token', otpController.createOTPCode);
router.post('/token', otpController.verifyToken);

module.exports = router;