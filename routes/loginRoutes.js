let express = require('express');
let router = express.Router();

let loginController = require('../controllers/loginController');
let otpController = require('../controllers/otpController');

router.post('/login', otpController.verifyToken, loginController.login);

module.exports = router;