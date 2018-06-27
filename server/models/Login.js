var mongoose = require('mongoose');

var LoginSchema = new mongoose.Schema({
	userID: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	ip: String,
	date: Date,
});

var Login = mongoose.model('Login', LoginSchema);

module.exports = Login;
