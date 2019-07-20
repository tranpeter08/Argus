"use strict";
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const employeeSchema = mongoose.Schema({
  employeeName:{
    firstName: {type: String, required: true},
    middleInit: {type: String, default: ""},
    lastName: {type: String, required: true}
  },
  contact:{
    phone: {type: String, required: true},
    email: {type: String, required: true}
  },
  certifications: [String],
  equipment: [String],
  notes: String
});

employeeSchema.virtual('employeeFullName').get(function() {
  return `${this.employeeName.firstName} ${this.employeeName.middleInit} ${this.employeeName.lastName}`
});

employeeSchema.methods.serialize = function() {
  return {
    id: this._id,
    employeeName: this.employeeFullName,
    phone: this.contact.phone,
    email: this.contact.email,
    certifications: this.certifications,
    equipment: this.equipment,
    notes: this.notes
  }
}

const Employees = mongoose.model('Employees', employeeSchema, 'employees');

module.exports = {Employees}