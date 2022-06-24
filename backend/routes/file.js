var express = require('express');
const multer  = require('multer');
var router = express.Router();

const FileController = require('../controllers/file.controller');
const upload = multer({ dest: './files/' })

router.post('/upload', upload.single('file'), FileController.uploadFile);
module.exports = router;