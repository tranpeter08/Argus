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

//GET request with ID
app.get('/:id', (req,res)=>{
    Employees.findByID(req.params.id)
    .then( employee => res.json(Employees.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: "An error has occured"})
    })
})


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