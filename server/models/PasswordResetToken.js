var mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema({
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

var PasswordResetToken = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);

module.exports = PasswordResetToken;
