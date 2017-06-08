const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const layouts       = require('express-ejs-layouts');
const mongoose      = require('mongoose');
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash         = require("connect-flash");
const ensureLogin   = require("connect-ensure-login");
const User          = require('./models/user.js');

var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb(process.env.API_KEY);

require('dotenv').config();

const app = express();

app.use(session({
  secret: 'my cool beer finder app',
  resave: true,
  saveUninitialized: true
}));

//initialize passport and session here

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if(req.user){
    res.locals.user = req.user;
  }
  next();
});

mongoose.connect('mongodb://localhost/beer-finder');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'crafty friendly beer finder';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const index = require('./routes/index');
app.use('/', index);

const router = require('./routes/router');
app.use('/', router);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((userId, cb) => {
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, theUser);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'
  },
  (loginUsername, loginPassword, next) =>{
    User.findOne({ username: loginUsername },
    (err, theUser) => {
      if(err) {
        next(err);
        return;
      }
      if (!theUser) {
        next(null, false);
        return;
      }
      if (!bcrypt.compareSync(loginPassword, theUser.password)) {
        next(null, false);
      }
      next(null, theUser);
    });
  }
));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
