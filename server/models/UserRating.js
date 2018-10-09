var mongoose = require('mongoose');

const UserRatingSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	ratedBy: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		default: 1,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

var UserRating = mongoose.model('UserRating', UserRatingSchema);

module.exports = UserRating;
