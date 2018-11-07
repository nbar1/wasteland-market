var mongoose = require('mongoose');

var PriceSchema = new mongoose.Schema({
	itemId: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	change: {
		type: Number,
		required: true,
	},
	datetime: {
		type: Date,
	},
});

PriceSchema.pre('save', function(next) {
	this.datetime = new Date();

	next();
});

var Price = mongoose.model('Price', PriceSchema);

module.exports = Price;
