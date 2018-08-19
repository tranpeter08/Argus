'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {Employees} = require("../models");
const {app, runServer, closeServer} = require("../server");
const {TEST_DATABASE_URL, TEST_PORT} = require("../config");

const expect = chai.expect;

chai.use(chaiHTTP);

function seedEmployeeData(){
    console.info('seeding employee data');
    const seedData = [];

    for(let i=1;i<=10;i++){
        seedData.push(generateEmployeeData());
    }

    return Employees.insertMany(seedData);
}

function generateEquipment(){
    const equipment = [];
    for(let i=0; i<3;i++){
        equipment.push(faker.lorem.word());
    }

    return equipment;
}

function generateCertifications(){
    const certifications = [];
    const certCollection = [
        'CWI','UT','MT','GPR','soils','concrete'
    ];

    while(certifications.length < 3){
        let randNum = 
            Math.floor(Math.random() * certCollection.length);
        let aCert = certCollection[randNum];

        if(!certifications.includes(aCert)){
            certifications.push(aCert);
        }
    }

    return certifications;
}

function generateEmployeeData(){
    return {
        employeeName: {
            firstName: faker.name.firstName(),
            middleInit: faker.lorem.slug(1),
            lastName: faker.name.lastName()
        },
        contact:{
            phone: faker.lorem.word(),
            email: faker.lorem.word(),
        },
        certifications: generateCertifications(),
        equipment: generateEquipment(),
        notes: faker.lorem.paragraph()
    }
}

function tearDownDb(){
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe("Employees API", function(){

    before(function(){
        return runServer(TEST_DATABASE_URL, TEST_PORT);
    });

    beforeEach(function(){
        return seedEmployeeData();
    })

    afterEach(function(){
        return tearDownDb();
    })

    after(function(){
        return closeServer();
    });


    describe("GET endpoint",function(){

        it("should return list of employees on GET", function(){
            let res;
            return chai.request(app)
            .get("/employees")
            .then(function(_res){
                res=_res;
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);
                return Employees.count();
            })
            .then(function(count){
                expect(res.body).to.have.lengthOf(count);
            });
        });

        it('should return employees with the right fields', function(){

            let resEmployee;
            return chai.request(app)
            .get('/employees')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                
                res.body.forEach(function(employee){
                    expect(employee).to.be.an('object');
                    expect(employee).to.include.keys(
                        'employeeName','phone','email','certifications','equipment','notes'
                    );
                });

                resEmployee = res.body[0];
                return Employees.findById(resEmployee.id);
            })
            .then(function(employee){
                expect(resEmployee.id).to.equal(employee.id);
                expect(resEmployee.employeeName).to
                .equal(`${employee.employeeName.firstName} ${employee.employeeName.middleInit} ${employee.employeeName.lastName}`);
                
                expect(resEmployee.phone).to.equal(employee.contact.phone);
                expect(resEmployee.email).to.equal(employee.contact.email);

                resEmployee.certifications.forEach(function(cert,index){
                    expect(cert).to.equal(employee.certifications[index]);
                });

                resEmployee.equipment.forEach(function(item,index){
                    expect(item).to.equal(employee.equipment[index]);
                });

                expect(resEmployee.notes).to.equal(employee.notes);
            });
        });

        it('should return an error when invalid ID is used', function(){
            return chai.request(app)
            .get('/employees/1')
            .then(function(res){
                expect(res).to.have.status(500);
                expect(res).to.be.json;
                expect(res.body.error).to.equal('Cast to ObjectId failed for value "1" at path "_id" for model "Employees"');
            })
        });
    });

    describe('POST endpoint', function(){
        it('should create a new Employee', function(){

            const newEmployee = generateEmployeeData();
            let newFirstName;
            let newMiddileInit;
            let newLastName;

            return chai.request(app)
            .post('/employees')
            .send(newEmployee)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys(
                    'id','employeeName','email','phone','certifications','equipment','notes'
                );
                expect(res.body.id).to.not.be.null;

                newFirstName = newEmployee.employeeName.firstName;
                newMiddileInit = newEmployee.employeeName.middleInit;
                newLastName = newEmployee.employeeName.lastName;

                expect(res.body.employeeName).to
                .equal(`${newFirstName} ${newMiddileInit} ${newLastName}`);

                expect(res.body.phone).to.equal(newEmployee.contact.phone);

                expect(res.body.email).to.equal(newEmployee.contact.email);

                res.body.certifications.forEach(function(cert,index){
                    expect(cert)
                    .to.equal(newEmployee.certifications[index])
                });

                res.body.equipment.forEach(function(item,index){
                    expect(item)
                    .to.equal(newEmployee.equipment[index]);
                });

                expect(res.body.notes).to.equal(newEmployee.notes);

                return Employees.findById(res.body.id);
            })
            .then(function(employee){
                expect(employee.employeeName.firstName)
                .to.equal(newFirstName);

                expect(employee.employeeName.middleInit)
                .to.equal(newMiddileInit);

                expect(employee.employeeName.lastName)
                .to.equal(newLastName);

                employee.certifications.forEach(function(cert,index){
                    expect(cert)
                    .to.equal(newEmployee.certifications[index])
                });

                employee.equipment.forEach(function(item,index){
                    expect(item)
                    .to.equal(newEmployee.equipment[index]);
                });
            
                expect(employee.notes).to.equal(newEmployee.notes);

            });
        });
    });

    describe("PUT endpoint", function(){
        it('should update and employee', function(){

            const updateData = {
                certifications:['GPR','soils'],
                notes: 'Needs to renew CWI'
            }
            
            return Employees
                .findOne()
                .then(function(employee){
                    updateData.id = employee.id;
                    return chai.request(app)
                        .put(`/employees/${updateData.id}`)
                        .send(updateData);
                })
                .then(function(res){
                    expect(res).to.have.status(204);

                    return Employees.findById(updateData.id);
                })
                .then(function(employee){
                    
                    employee.certifications
                    .forEach(function(cert, index){
                        expect(cert)
                        .to.equal(updateData.certifications[index]);
                    });
                });
        });
    });

    describe("DELETE endpoint",function(){
        it("should delete an Employee", function(){
            let employee;

            return Employees
            .findOne()
            .then(function(_employee){
                employee = _employee;

                return chai.request(app)
                    .delete(`/employees/${employee.id}`)
            })
            .then(function(res){
                expect(res).to.have.status(204);

                return Employees.findById(employee.id);
            })
            .then(function(ghost){
                expect(ghost).to.be.null
            })
        });
    });
});