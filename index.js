const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express(); 
var bodyParser = require('body-parser');
var fs = require('fs');
var Marker = require('./app/db/Marker');
var User = require('./app/db/user');

var incorrectLogin = "";
var incorrectSignup = "";
var usernames = "";

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/openstreets', {useNewUrlParser:true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("Connected to server!");
});

exports.test = function(req,res) {
	res.render('test');
};

app
	.use(express.static(path.join(__dirname, 'public')))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended:false}))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')

app.get('/', function(req, res){
	Marker.find(function(err, data){
		if (err) return console.error(err);

		var newData = [];
		for(var i = 0; i < data.length; i++){
			newData.push({"latitude": data[i].latitude, "longitude": data[i].longitude, "address": data[i].address, "date": data[i].date, "icon": data[i].icon, "details": data[i].details, 'postedby': data[i].postedby});
		}
		res.render('pages/main', {data: newData, incorrectLogin: incorrectLogin, incorrectSignup:incorrectSignup, username: usernames});
	});
});

app.post("/map", function(req, res){
	if(usernames==""){
		res.redirect("/");
		return;
	} 
	var marker = new Marker({
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		address: req.body.address,
		date: new Date(),
		icon: req.body.icon,
		details: req.body.details,
		postedby: usernames
	});

	marker.save(function(err){
		if (err) console.log(err);
		res.redirect("/");
	});
});

app.post("/loggedin", function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	if(username=="" || password==""){
		incorrectLogin = "Please enter username and password";
    	res.redirect("/");
    	return ;
	}

	User.findOne({$and: [{username:username}, {password:password}]}, function(err, user) {
    	if (err || !user) {
    		incorrectLogin = "Invalid username / password";
    		res.redirect("/");
    	} else {
    		incorrectLogin = "";
    		usernames = username;
    		res.redirect("/");
    	}
	});
});

app.post("/signedup", function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;

	if (username=="" || password=="" || confirmPassword==""){
		incorrectSignup = "Please fill out all required fields";
		res.redirect("/");
		return ;
	} else if (password!=confirmPassword) {
		incorrectSignup = "Passwords do not match";
		res.redirect("/");
		return ;
	} 
	incorrect = "";
	var user = new User({
		username: username,
		password: password,
	});

	user.save(function(err){
		if (err) console.log(err);
		usernames = username;
		res.redirect("/");
	});
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));