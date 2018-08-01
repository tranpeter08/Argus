'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require("../server");
const {TEST_DATABASE_URL, TEST_PORT} = require("../config");

const expect = chai.expect;

chai.use(chaiHTTP);

describe("Employees", function(){

    before(function(){
        return runServer(TEST_DATABASE_URL, TEST_PORT);
    });

    after(function(){
        return closeServer();
    });


    describe("GET endpoint",function(){

        it("should return list of employees on GET", function(){
            return chai.request(app)
            .get("/employees")
            .then(function(res){
                expect(res).to.have.status(200);
            });
        });
    })
   
});