var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
	open: {
		type: Boolean,
		default: true,
		required: true,
	},
	item: {
		type: String,
		required: true,
	},
	itemId: {
		type: String,
		required: true,
	},
	unusual: {
		type: Boolean,
		default: false,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	level: {
		type: Number,
	},
	quantity: {
		type: Number,
		required: true,
	},
	platform: {
		type: String,
		required: true,
	},
	includeDiscord: {
		type: Boolean,
		default: false,
	},
	includeSteam: {
		type: Boolean,
		default: false,
	},
	notes: {
		type: String,
	},
	date: {
		type: Date,
		required: true,
	},
	addedBy: {
		type: String,
		required: true,
	},
	addedByIP: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
		required: true,
	},
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
