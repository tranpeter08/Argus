'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {session: false}, 
    (error, user, info) => {

      if (info && info.reason === 'LoginError') {
        return res.status(info.code).json(info);
      }

      if (user) {
        console.log(user)
        const authToken = createAuthToken(user.serialize());
        return res.json({authToken});
      }

      return next(error);
      
  })(req);
});

const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/refresh', jwtAuth, (req,res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};