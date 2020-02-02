var mongoose = require("mongoose");

var markerSchema = new mongoose.Schema({
	latitude: Number,
	longitude: Number,
	address: String,
	date: Date,
	icon: String,
	details: String
});
var Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;