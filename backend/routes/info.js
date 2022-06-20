var express = require('express');
const InfoController = require('../controllers/info.controller')
var router = express.Router();
router.post('/getAllInfo', InfoController.getAllInfo);
router.post('/getLocations', InfoController.getLocations);
router.post('/getResult', InfoController.getResult);

module.exports = router;