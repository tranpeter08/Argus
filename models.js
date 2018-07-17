const mongoose = require('mongoose');
const faker = require('faker');
mongoose.Promise = global.Promise;

/*
const employeeSchema = mongoose.Schema({
    employeeName:{
        firstName: {Type: String, required: true},
        lastName: {Type: String, required: true}
    },
    certifications:[String],
    equipment:[String],
    notes: String
})
*/

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



module.exports = {Employees}