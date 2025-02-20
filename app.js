const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { register } = require("module");

const app = express();
const port = 3000;

//middleware to serve static data
app.use(express.static(path.join(__dirname, "public")));

let message = "Wouldn't you like to be a pepper too?";

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//sets up the session variable
app.use(session({
    secret:"12345",
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}// Set to true is using https
}));

function isAuthenticated(req,res, next){
    if(req.session.user)return next();
    return res.redirect("/login.html");
}

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

//MongoDB connection setup
const mongoURI = "mongodb://localhost:27017/games";
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Connection Error"));
db.once("open", ()=>{console.log("Connected to MongoDB database")});

/*db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});*/

app.get("/auth-status", (req, res) => {
    res.json({ isAuthenticated: !!req.session.user });
});
  
//App Routes

app.get("/register", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "register.html"));
})

app.post("/register", async (req,res)=>{
    try{
        const {username, password, email} = req.body;

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.send("Username already taken. Try a different one")
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({username, password:hashedPassword, email});
        await newUser.save();

        res.redirect("/login");

    }catch(err){
        res.status(500).send("Error registering new user.");
    }
});

app.get("/",(req,res)=>{
    res.sendFile("index.html");
});

//Setup Mongoose Schema
const gameSchema = new mongoose.Schema({
    Name:String,
    Developer:String,
    Designer:String
});

const Game = mongoose.model("Game", gameSchema, "games");

//Read routes
app.get("/games", async (req, res)=>{
    try{
        const games = await Game.find();
        res.json(games);
        console.log(games);
    }catch(err){
        res.status(500).json({error:"Failed to get details."});
    }
});


//Create routes
app.post("/addgame", isAuthenticated, async (req, res)=>{
    try{
        const newGame = new Game(req.body);
        const saveGame = await newGame.save();
        //res.status(201).json(savePerson);
        res.redirect("/index.html");
        console.log(saveGame);
    }catch(err){
        res.status(501).json({error:"Failed to add game."});
    }
});

app.post("/login", async (req,res)=>{
    const {username, password} = req.body;
    console.log(req.body);

    const user = await User.findOne({username});

    if(user && bcrypt.compareSync(password, user.password)){
        req.session.user = username;
        return res.redirect("/index.html");
    }
    req.session.error = "Invalid User";
    return res.redirect("/login.html")
});

app.get("/logout", (req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login.html");
    })
});

//Update Route
app.put("/updategame/:id", isAuthenticated, (req,res)=>{
    //Example of a promise statement for async fucntion
    Game.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    }).then((updatedGame)=>{
        if(!updatedGame){
            return res.status().json({error:"Failed to find game."});
        }
        res.json(updatedGame);
    }).catch((err)=>{
        res.status(400).json({error:"Failed to update the game."});
    });
});

//Delete route
app.delete("/deletegame/:id", isAuthenticated, async (req,res)=>{
    try{
        await Game.findByIdAndDelete(req.params.id);
        
        if(game.length === 0){
            return res.status(404).json({error:"Failed to find the game."});
        }

    }catch(err){
        console.log(err);
        res.status(404).json({error:"game not found"});
    }
    //res.redirect("/index.html");
});

app.listen(port, function()
{
    console.log(`Server is running on port: ${port}`);
})

