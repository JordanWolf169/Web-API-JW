const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Person = require("./models/Person");
const { register } = require("module");

const app = express();
const port = 3000;

//middleware to serve static data
app.use(express.static(path.join(__dirname, "public")));

let message = "Wouldn't you like to be a pepper too?";

function sendMessage()
{
    console.log(message);
}

//sendMessage();

//our first route
app.get("/", function(req, res)
{
    //res.send("hello world!");
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/testjson", (req,res)=>
{
    res.sendFile(path.join(__dirname, "public", "json/games.json"))
})

setTimeout(()=>
{
    console.log("Hello in 2 sec!")
}, 2000)

setTimeout(()=>
{
    console.log("Hello Now!")
}, 0)

app.listen(port, function()
{
    console.log(`Server is running on port: ${port}`);
})

