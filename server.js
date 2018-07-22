"use strict";

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

const {DATABASE_URL, PORT} = require('./config');
const {Employees} = require('./models');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static("public"))

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
        res.status(500).json({error: "An error has occured"})
    })
})


//POST
app.post('/employees', jsonParser,(req,res)=>{
    console.log(req.body);
    Employees.create({
        employeeName: {
            firstName: req.body.employeeName.firstName,
            middleInit: req.body.employeeName.middleInit,
            lastName: req.body.employeeName.lastName
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

//DELETE


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
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};