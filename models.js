"use strict";

const mongoose = require('mongoose');
const faker = require('faker');
mongoose.Promise = global.Promise;


const employeeSchema = mongoose.Schema({
    employeeName:{
        firstName: {type: String},
        middleInit: {type: String, default: ""},
        lastName: {type: String}
    },
    certifications:[String],
    equipment:[String],
    notes: String
})

employeeSchema.virtual('employeeFullName').get(function(){
    return `${this.employeeName.firstName} ${this.employeeName.middleInit} ${this.employeeName.lastName}`
})

employeeSchema.methods.serialize = function () {
    return {
        id: this._id,
        employeeName: this.employeeFullName,
        certifications: this.certifications,
        equipment: this.equipment,
        notes: this.notes
    }
}

const Employees = mongoose.model('Employees', employeeSchema, 'employees');
/*
const Employees = [
    {
        employeeName : faker.name.findName(),
        certifications:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        equipment:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        notes: faker.lorem.paragraph()
    },{
        employeeName : faker.name.findName(),
        certifications:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        equipment:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        notes: faker.lorem.paragraph()
    },{
        employeeName : faker.name.findName(),
        certifications:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        equipment:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        notes: faker.lorem.paragraph()
    },{
        employeeName : faker.name.findName(),
        certifications:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        equipment:[faker.lorem.word(),faker.lorem.word(),faker.lorem.word()],
        notes: faker.lorem.paragraph()
    }
]
*/


module.exports = {Employees}