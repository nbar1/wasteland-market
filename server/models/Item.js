var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ItemSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		uniqueCaseInsensitive: true,
	},
	image: {
		type: String,
		trim: true,
	},
	dateAdded: {
		type: Date,
	},
	addedBy: {
		type: String,
	},
	addedByIP: {
		type: String,
	},
	enabled: {
		type: Boolean,
		default: true,
		required: true,
	},
});

ItemSchema.plugin(uniqueValidator);

ItemSchema.pre('save', function(next) {
	let item = this;
	item.dateAdded = new Date();

	next();
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
