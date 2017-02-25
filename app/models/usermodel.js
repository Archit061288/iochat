var mongoose = require("mongoose");

var userschema = mongoose.Schema({
	username:String,
	email:String,
	password:String
})

var users = mongoose.model("User",userschema)

module.exports= {
	User:users
}