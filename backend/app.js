var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
const throttle = require('express-throttle-bandwidth')
var infoRouter = require('./routes/info');
var fileRouter = require('./routes/file');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/info', infoRouter);
app.use('/file', fileRouter);

app.use(function(req, res, next) {
    next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
  
module.exports = app;