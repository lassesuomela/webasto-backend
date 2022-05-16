let express = require('express');
let router = express.Router();

let tempController = require('../controllers/tempController');

router.get('/temp', tempController.getTemperature);

router.post('/temp', tempController.updateTemperature);

module.exports = router;