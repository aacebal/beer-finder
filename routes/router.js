const express = require('express');

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const ensure         = require('connect-ensure-login');

const router  = express.Router();

router.get('/main', (req, res, next) => {
  res.render('main.ejs', {
    user: req.user
  });
});

module.exports = router;
