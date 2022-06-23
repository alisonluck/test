var express = require('express');
const InfoController = require('../controllers/info.controller');
const auth = require('../middleware/auth');
var router = express.Router();

router.post('/register', InfoController.register);
router.post('/login', InfoController.login);

router.post('/getAllInfo', auth,  InfoController.getAllInfo);
router.post('/getLocations', auth,  InfoController.getLocations);
router.post('/getResult', auth, InfoController.getResult);
router.post('/getScoreboard', auth, InfoController.getScoreboard);
router.post('/getChartData', auth, InfoController.getChartData);

module.exports = router;