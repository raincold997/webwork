var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');
var sqlite3 = require('sqlite3');
var sqlHelper = require('./database/sqlHelper');
var async = require('async')



var index = require('./routes/index');
var users = require('./routes/users');
var photo = require('./routes/photos');

var app = express();

sqlHelper.connect(function (err) {
    if(err) throw err;
});

app.on('close',function(err){
    sqlHelper.disconnect(function (err) {
        
    });
});



app.use(session({
    secret: 'secret',
    cookie:{
        maxAge: 1000*60*30
}
}));

app.use(function(req,res,next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = "";
    if(err){
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express);
//app.set('view engine', 'ejs');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
    var url = req.originalUrl;
    if(url !== "/registe" && url !== "/login" && !req.session.user){
        return res.redirect("/login");
    }
    next();
})

app.use('/', index);
app.use('/users', users);
app.use('/registe',index);
app.use('/login',index);
app.use('/home',index);
app.use('/photo',photo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
