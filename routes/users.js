const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in user models
let Article = require('../models/user');
const user = require('../models/user');

//Register form
router.get('/register', function (req, res) {
  res.render('register');
});

//Register proccess
router.post('/register', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  req
    .checkBody('password2', 'passwords do not match')
    .equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
    });
  } else {
    let newUser = new user({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function (err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'you are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

//login form
router.get('/login', function (req, res) {
  res.render('login');
});

//login process
router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

//logout
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'you are logged out');
  res.redirect('/users/login');
});

module.exports = router;
