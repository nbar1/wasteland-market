var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
	item: {
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
	quantity: {
		type: Number,
		required: true,
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

OrderSchema.pre('save', function(next) {
	let order = this;
	order.dateAdded = new Date();

	next();
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
