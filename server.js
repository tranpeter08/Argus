"use strict";

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

const {DATABASE_URL, PORT} = require('./config');
const {Employees} = require('./models');

const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static("public"));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users',usersRouter);
app.use('/api/auth', authRouter);

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

//protected endpoint
app.get('/api/protected', jwtAuth, (req, res)=>{
    return res.json({
        message: 'Success'
    });
});

//GET request
app.get('/employees',(req, res)=>{
    Employees.find()
    .then(staff => {
        console.log(staff);
        res.json(staff.map(individual => individual.serialize()));
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'An error has occurred.'});
    })
});

//GET request with ID
app.get('/employees/:id', (req,res)=>{
    Employees.findById(req.params.id)
    .then( employee => res.json(employee))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: err.message});
    })
});

//POST
app.post('/employees', jsonParser,(req,res)=>{
    const requiredFields = [
        'employeeName','certifications','equipment','notes'
    ];
    for(let i=0;i<requiredFields.length;i++){
        const field = requiredFields[i];
        if(!field in req.body){
            const message = `Missing '${field}' in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    const requiredNameFields = ['firstName', 'lastName'];
    for(let i = 0; i < requiredNameFields.length;i++){
        const nameField = requiredNameFields[i];
        if(!nameField in req.body.employeeName){
            const message = `Missing ${nameField} in EmployeeName`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Employees.create({
        employeeName: {
            firstName: req.body.employeeName.firstName,
            middleInit: req.body.employeeName.middleInit,
            lastName: req.body.employeeName.lastName
        },
        contact:{
            phone: req.body.contact.phone,
            email: req.body.contact.email
        },
        certifications: req.body.certifications,
        equipment: req.body.equipment,
        notes: req.body.notes
    })
    .then(newEmployee => res.status(201).json(newEmployee.serialize()))
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: 'An error has occured'});
    })
});

//PUT
app.put('/employees/:id', (req, res)=>{
    if(req.params.id !== req.body.id){
        const message = `response body and parameter ID do not match`
        console.error(message);
        res.status(400).json({error: message});
    }

    const updated = {};
    const updateableFields = ['employeeName','contact','certifications','equipment','notes'];
    updateableFields.forEach(field=>{
        if(field in req.body){
            updated[field]= req.body[field];
        }
    });

    
    Employees.findByIdAndUpdate(
        req.params.id,{$set: updated},{new: true}
    )
    .then(updatedEmployee => res.status(204).end())
    .catch(
        err => res.status(500).json({error:`An error has occurred`})
    )
})

//DELETE 
app.delete('/employees/:id', (req,res)=>{
    Employees.findByIdAndRemove(req.params.id)
    .then(()=>{
        console.log(`Deleted employee with ID: ${req.params.id}`)
        res.status(204).end();
    });
});

app.use('*', (req, res)=>{
    res.status(404).json({message: 'Not Found'});
});


let server;

function runServer(databaseURL, port=PORT){
    return new Promise((resolve, reject)=>{
        mongoose.connect(databaseURL, err =>{
            if(err){
                return reject(err);
            }
            server = app.listen(port, ()=>{
                console.log(`Your app is listening on port ${port}`)
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
    return mongoose.disconnect().then(()=>{
        return new Promise((resolve, reject)=>{
            console.log('Closing server');
            server.close(err=> {
                if(err){
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