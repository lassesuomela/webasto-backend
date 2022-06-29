let express = require('express');
let router = express.Router();

let loginController = require('../controllers/loginController');

router.post('/login', loginController.login);

module.exports = router;