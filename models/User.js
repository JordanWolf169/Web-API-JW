const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name:{type:String, required:true, unique:true},
    Developer:{type:String, required:true},
    Designer:{type:String, required:true}
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User