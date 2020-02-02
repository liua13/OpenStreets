const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express(); 
var bodyParser = require('body-parser');
var Marker = require('./app/db/Marker');

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
	.get('/map', (req, res) => res.render('pages/map'));

app.get('/', function(req, res){
	Marker.find(function(err, data){
		if (err) return console.error(err);

		var newData = [];
		for(var i = 0; i < data.length; i++){
			newData.push({"latitude": data[i].latitude, "longitude": data[i].longitude, "address": data[i].address, "date": data[i].date, "icon": data[i].icon, "details": data[i].details});
		}
		console.log(newData);
		res.render('pages/main', {data: newData});
	});
});

app.post("/map", function(req, res){
	var marker = new Marker({
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		address: req.body.address,
		date: new Date(),
		icon: req.body.icon,
		details: req.body.details
	});

	marker.save(function(err){
		if (err) console.log(err);
		res.redirect("/");
	});
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));