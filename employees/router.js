const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const {Employees} = require('./models');

mongoose.Promise = global.Promise;

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth,(req, res)=>{
  Employees.find()
  .then(staff => {
    res.json(staff.map(individual => individual.serialize()));
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'An error has occurred.'});
  })
});

router.get('/:id', jwtAuth, (req,res)=>{
  Employees.findById(req.params.id)
  .then( employee => res.json(employee))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: err.message});
    })
});

router.post('/', jwtAuth,(req,res)=>{
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

router.put('/:id', jwtAuth, (req, res)=>{
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

router.delete('/:id', jwtAuth, (req,res)=>{
    Employees.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.status(204).end();
    });
});

module.exports = {router};