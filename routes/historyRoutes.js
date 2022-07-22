let express = require('express');
let router = express.Router();

let historyController = require('../controllers/historyController');

router.get('/history/:page', historyController.fetchNHistoryRecord);

module.exports = router;