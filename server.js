const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
mongoose.Promise = global.Promise;

const {PORT} = require('./config');
const {Employees} = require('./models');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static("public"))

//GET request
app.get('/employees',(req, res)=>{
    res.json(Employees);
});

//POST
app.post('/employees',(req,res)=>{
    console.log(req.body);
});

//PUT

//DELETE

if(require.main === module){

app.listen(PORT, ()=>{
    console.log(`Your app is listening on port ${PORT}`);

});
}
module.exports = app;