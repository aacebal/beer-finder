const express        = require('express');
const router         = express.Router();
const User           = require('../models/user.js');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/signup', ensureLogin.ensureNotLoggedIn(), (req, res, next) => {
  const signupName = req.body.nameInput;
  const signupUsername = req.body.usernameInput;
  const signupPassword = req.body.passwordInput;
  const signupEmail = req.body.emailInput;

if (signupUsername === '' || signupPassword ==='') {
  res.render('/',
  { errorMessage: "Please provide both username and password"
});
return;
}
else if (true) {
  User.findOne(
    { username: signupUsername },
    { username: 1},
    (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }
      if(foundUser){
        res.render('/',
      { errorMessage: 'Username is taken'});
      return;
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(signupPassword, salt);

      const theUser = new User({
        name: signupName,
        username: signupUsername,
        email: signupEmail,
        password: hashPass
      });
      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/main');
      });
    });
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/'
})
);

router.get('/logout', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
