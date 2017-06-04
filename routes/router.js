const express = require('express');

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User           = require('../models/user.js');
const passport       = require("passport");
const ensure         = require('connect-ensure-login');
const multer         = require('multer');
const path           = require('path');

const myUploader = multer({ dest: path.join(__dirname, '../public/images')
});

const router  = express.Router();

router.get('/main', ensure.ensureLoggedIn(), (req, res, next) => {
  res.render('main.ejs', {
    user: req.user
  });
});

router.post('/main/profile-pic/:id', myUploader.single('postPicPath'), (req, res, next) => {
  const userId = req.params.id;

  const userChanges = {
    profilePic: `/images/${req.file.filename}`
  };

  User.findByIdAndUpdate(userId, userChanges, (err, theUser)=> {
    if(err) {
        res.render('/main', {
          user: theUser,
          validationErrors:theUser.errors
        });
        return;
      }
      res.redirect('/main');
    });
  });


module.exports = router;
