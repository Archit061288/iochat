var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var server = require("http").createServer(app)
var io = require("socket.io")(server);
var User = require('./app/models/usermodel').User
var users = [];
var connections=[];

var db = "mongodb://localhost/iochat";
mongoose.connect(db)



app.use(express.static(__dirname + '/public'));

app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");	
})

io.sockets.on("connection",function(socket){
	
	connections.push(socket);
	console.log("connection %s",connections.length)
	socket.on("new user",function(data){
		
		// Save Username and Password
		var user = new User({
			username:data.username,
			email:data.email,
			password:data.password
		});
		user.save();

		socket.username = data.username;
		users.push(socket.username);
		console.log(users)
		updateuserdata();
	})

	socket.on("disconnect",function(data){
		users.splice(users.indexOf(socket.username),1)
		console.log(users)
		updateuserdata();
		connections.splice(connections.indexOf(socket),1)
		
		console.log("Disconnect %s sockets connected",connections.length)
	})

	socket.on("send message",function(data){

		io.sockets.emit("notify everyone",{user : socket.username,comment : data});
		io.sockets.emit('sendmesg',{msg:data,user:socket.username})
	})

	function updateuserdata(){
		//console.log(users)
		io.sockets.emit("userlist",users)		
	}
	
})




server.listen(3000)

