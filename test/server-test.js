'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const app = require("../server");

const expect = chai.expect;

chai.use(chaiHTTP);

describe("index page", function(){
    it("should exist", function(){
        return chai.request(app)
        .get("/employees")
        .then((res)=>{
            expect(res).to.have.status(200);
        });
    });
});