'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const {Employees} = require('../employees/index');
const {User} = require('../users');
const {app, runServer, closeServer} = require("../server");
const {TEST_DATABASE_URL, TEST_PORT, JWT_SECRET} = require("../config");

const expect = chai.expect;

chai.use(chaiHTTP);

function seedEmployeeData(){
  console.info('Seeding employee data');
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push(generateEmployeeData());
  }

  return Employees.insertMany(seedData);
}

function generateEquipment() {
  const equipment = [];
  for (let i=0; i < 3; i++) {
    equipment.push(faker.lorem.word());
  }

  return equipment;
}

function generateCertifications(){
  const certifications = [];
  const certCollection = [
    'CWI','UT','MT','GPR','soils','concrete'
  ];

  while (certifications.length < 3) {
    let randNum = 
      Math.floor(Math.random() * certCollection.length);
    let aCert = certCollection[randNum];

    if (!certifications.includes(aCert)) {
      certifications.push(aCert);
    }
  }

  return certifications;
}

function generateEmployeeData() {
  return {
    employeeName: {
      firstName: faker.name.firstName(),
      middleInit: faker.lorem.word(),
      lastName: faker.name.lastName()
    },
    contact:{
      phone: faker.phone.phoneNumber(),
      email: faker.internet.email(),
    },
    certifications: generateCertifications(),
    equipment: generateEquipment(),
    notes: faker.lorem.paragraph()
  }
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

//hashpassword
function generateUser(username, pass) {
  return User.hashPassword(pass)
    .then(password =>
      User.create({username, password})
  );
}

function removeUser() {
  return User.remove({});
}

describe("Employees API", function(){
  const username = 'exmapleUser';
  const password = 'examplePass';

  before(function() {
    return runServer(TEST_DATABASE_URL, TEST_PORT);
  });

  beforeEach(function() {
    return seedEmployeeData(), generateUser(username,password);
  })

  afterEach(function() {
    return tearDownDb(), removeUser();
  })

  after(function() {
    return closeServer();
  });

  describe("GET endpoint",function() {
    describe('requests with an invalid token', function() {
      it("Should reject requests with no credentials", function() {
        return chai 
          .request(app)
          .get("/employees")
          .then((res)=>
            expect(res).to.have.status(401)
          )
      })

      it("should reject requests with an invalid token", function() {
        const token = jwt.sign(
          {username},
          'wrongSecret',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );

        return chai
          .request(app)
          .get('/employees')
          .set('Authorization', `Bearer ${token}`)
          .then((res)=>
            expect(res).to.have.status(401)  
          );
      })

      it('should reject requests with an expired token', function() {
          const token = jwt.sign(
            {
              user: {username},
              exp: 0,
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
            }
          );

          return chai
              .request(app)
              .get('/employees')
              .set('Authorization', `Bearer ${token}`)
              .then((res)=>
              expect(res).to.have.status(401)
              );
      });
    });

      describe('requests using a valid token', function(){
          const token = jwt.sign(
              {
                user: {username},
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: username,
                expiresIn: '7d'
              }
          );

          it("should return list of employees", function(){
              let res;
              return chai.request(app)
              .get("/employees")
              .set('authorization', `Bearer ${token}`)
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
              .set('authorization', `Bearer ${token}`)
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
          
          it('should return an employee with a valid ID', function(){
              let employee;
              return Employees
              .findOne()
              .then(_employee =>{
              employee = _employee;
              return chai.request(app)
                  .get(`/employees/${employee.id}`)
                  .set('authorization', `Bearer ${token}`)
              })
              .then(res=>{
                  expect(res).to.have.status(200);
                  expect(res).to.be.json;
                  expect(res).to.be.an('object');
                  expect(res.body).to.include.keys(
                      '_id','employeeName','contact','certifications','equipment','notes'
                  )
                  expect(res.body._id).to.equal(employee.id);

                  expect(res.body.employeeName.firstName)
                    .to.equal(employee.employeeName.firstName);

                  expect(res.body.employeeName.middleInit)
                    .to.equal(employee.employeeName.middleInit);

                  expect(res.body.employeeName.lastName)
                    .to.equal(employee.employeeName.lastName);

                  expect(res.body.contact.phone).to.equal(employee.contact.phone);
                  expect(res.body.contact.email).to.equal(employee.contact.email);

                  expect(res.body.certifications).to.deep.equal(employee.certifications);  
                  expect(res.body.equipment).to.deep.equal(employee.equipment);
                  expect(res.body.notes).to.equal(employee.notes);

              })
          })

          it('should return an error when invalid ID is used', function(){
              return chai.request(app)
              .get('/employees/1')
              .set('authorization', `Bearer ${token}`)
              .then(function(res){
                  expect(res).to.have.status(500);
                  expect(res).to.be.json;
              })
          });
      })
        
    });

    describe('POST endpoint', function(){
        describe('requests with an invalid token', function(){
            it("should reject requests with no credentials", function(){
                return chai 
                  .request(app)
                  .post("/employees")
                  .then((res)=>
                    expect(res).to.have.status(401)
                  )
            })
    
            it("should reject requests with an invalid token", function(){
                const token = jwt.sign(
                    {username},
                    'wrongSecret',
                    {
                      algorithm: 'HS256',
                      expiresIn: '7d'
                    }
                );
    
                return chai
                  .request(app)
                  .post('/employees')
                  .set('Authorization', `Bearer ${token}`)
                  .then((res)=>
                    expect(res).to.have.status(401)  
                  );
            })
    
            it('should reject requests with an expired token', function(){
                const token = jwt.sign(
                    {
                        user: {username},
                        exp: 0,
                    },
                    JWT_SECRET,
                    {
                        algorithm: 'HS256',
                        subject: username,
                    }
                );
    
                return chai
                  .request(app)
                  .post('/employees')
                  .set('Authorization', `Bearer ${token}`)
                  .then((res)=>
                    expect(res).to.have.status(401)
                  );
            });
        })
       
        
        describe('requests with a valid token', function(){
            const token = jwt.sign(
                {
                  user: {username},
                },
                JWT_SECRET,
                {
                  algorithm: 'HS256',
                  subject: username,
                  expiresIn: '7d'
                }
            );

            it('should create a new Employee', function(){

                const newEmployee = generateEmployeeData();
                let newFirstName;
                let newMiddileInit;
                let newLastName;
    
                return chai.request(app)
                .post('/employees')
                .send(newEmployee)
                .set('Authorization', `Bearer ${token}`)
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
    
                    expect(res.body.certifications)
                        .to.deep.equal(newEmployee.certifications);
                    expect(res.body.equipment)
                        .to.deep.equal(newEmployee.equipment);
    
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
    
                    expect(employee.certifications)
                        .to.deep.equal(newEmployee.certifications)
                    
                    expect(employee.equipment)
                        .to.deep.equal(newEmployee.equipment);
                    
                    expect(employee.notes).to.equal(newEmployee.notes);
                });
            });
        });
    });

    describe("PUT endpoint", function(){
        describe('requests with an invalid token', function(){
            let updateID;

            it("Should reject requests with no credentials", function(){
                return Employees
                .findOne()
                .then(employee =>{
                    updateID = employee.id;
                    return chai
                    .request(app)
                    .put(`/employees/${updateID}`)
                })
                .then(res=>
                    expect(res).to.have.status(401)
                );
            })
    
            it("should reject requests with an invalid token", function(){
                const token = jwt.sign(
                    {username},
                    'wrongSecret',
                    {
                      algorithm: 'HS256',
                      expiresIn: '7d'
                    }
                );
    
                return chai
                  .request(app)
                  .put(`/employees/${updateID}`)
                  .set('Authorization', `Bearer ${token}`)
                  .then((res)=>
                    expect(res).to.have.status(401)  
                  );
            })
    
            it('should reject requests with an expired token', function(){
                const token = jwt.sign(
                    {
                        user: {username},
                        exp: 0,
                    },
                    JWT_SECRET,
                    {
                        algorithm: 'HS256',
                        subject: username,
                    }
                );
    
                return chai
                  .request(app)
                  .put(`/employees/${updateID}`)
                  .set('Authorization', `Bearer ${token}`)
                  .then((res)=>
                    expect(res).to.have.status(401)
                  );
            });
        })

        describe("requests with a valid token", function(){
            const token = jwt.sign(
                {
                  user: {username},
                },
                JWT_SECRET,
                {
                  algorithm: 'HS256',
                  subject: username,
                  expiresIn: '7d'
                }
            );

            it('should update an employee', function(){

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
                            .set('Authorization', `Bearer ${token}`)
                            .send(updateData);
                    })
                    .then(function(res){
                        expect(res).to.have.status(204);
                        return Employees.findById(updateData.id);
                    })
                    .then(function(employee){
                        expect(employee.certifications)
                           .to.deep.equal(updateData.certifications);
                        expect(employee.notes).to.equal(updateData.notes);
                    });
            });
        });
    });

    describe("DELETE endpoint",function(){
        describe('requests with an invalid token', function(){
            let deleteID;


            it("Should reject requests with no credentials", function(){
                return Employees
                .findOne()
                .then(employee =>{
                    deleteID = employee.id;
                    return chai
                    .request(app)
                    .delete(`/employees/${deleteID}`)
                })
                .then(res=>
                    expect(res).to.have.status(401)
                );
            })
    
            it("should reject requests with an invalid token", function(){
                const token = jwt.sign(
                    {username},
                    'wrongSecret',
                    {
                      algorithm: 'HS256',
                      expiresIn: '7d'
                    }
                );
    
                return chai
                  .request(app)
                  .delete(`/employees/${deleteID}`)
                  .set('Authorization', `Bearer ${token}`)
                  .then((res)=>
                    expect(res).to.have.status(401)  
                  );
            })
    
            it('should reject requests with an expired token', function(){
                const token = jwt.sign(
                    {
                        user: {username},
                        exp: 0,
                    },
                    JWT_SECRET,
                    {
                        algorithm: 'HS256',
                        subject: username,
                    }
                );
    
                return chai
                  .request(app)
                  .delete(`/employees/${deleteID}`)
                  .set('Authorization', `Bearer ${token}`)
                  .then((res)=>
                    expect(res).to.have.status(401)
                  );
            });
        });

        describe('requests with a valid token', function(){
            const token = jwt.sign(
                {
                  user: {username},
                },
                JWT_SECRET,
                {
                  algorithm: 'HS256',
                  subject: username,
                  expiresIn: '7d'
                }
            );

            it("should delete an Employee", function(){
                let employee;
                
                return Employees
                .findOne()
                .then(function(_employee){
                    employee = _employee;

                    return chai.request(app)
                        .delete(`/employees/${employee.id}`)
                        .set('Authorization', `Bearer ${token}`)
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
});