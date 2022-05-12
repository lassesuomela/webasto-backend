let express = require('express');
let router = express.Router();

let statusController = require('../controllers/statusController');

router.get('/status/:id', statusController.getStatus);

router.post('/status/:id', statusController.modifyStatus);

module.exports = router;