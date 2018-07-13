var mongoose = require('mongoose');

const VerificationTokenSchema = new mongoose.Schema({
	_userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 43200,
	},
});

var VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema);

module.exports = VerificationToken;
