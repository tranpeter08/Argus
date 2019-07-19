"use strict";

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const {DATABASE_URL, PORT} = require('./config');
const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const {router: employeesRouter} = require('./employees');

const app = express();
mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if(req.method === 'OPTIONS'){
      return res.send(204);
  }
  next();
});

const jwtAuth = passport.authenticate('jwt', {session: false});

app.use('/employees/users',usersRouter);
app.use('/employees/auth', authRouter);
app.use('/employees', jwtAuth, employeesRouter);

app.use('*', (req, res)=>{
    res.status(404).json({message: 'Not Found'});
});

let server;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true
}

function runServer(databaseURL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, options,err =>{
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err =>{
        mongoose.disconnect()
        reject(err);
      });
    });
  });
}

function closeServer(){
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
        server.close(err => {
          if (err) {
              return reject(err);
          }
          resolve();
        });
    });
  });
}

if(require.main === module){
  runServer(DATABASE_URL)
  .catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};