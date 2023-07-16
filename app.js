require('dotenv').config();
require('./Database/db')
const bodyParser = require('body-parser');
const port=process.env.PORT||5000;
const express=require('express')
const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine","ejs");
const routers=require('./Router//Routers')
app.use(routers);
app.listen(port,(req,res)=>{
    console.log("listening")
});