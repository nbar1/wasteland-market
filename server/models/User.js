var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		uniqueCaseInsensitive: true,
	},
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		uniqueCaseInsensitive: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordConf: {
		type: String,
		required: true,
	},
	premium: {
		type: Boolean,
		default: false,
		required: true,
	},
	platforms: {
		type: Map,
		of: String,
	},
	dateRegistered: Date,
	registrationIP: String,
	enabled: {
		type: Boolean,
		default: true,
		required: true,
	},
});

UserSchema.plugin(uniqueValidator);

// authenticate input against database
UserSchema.statics.authenticate = (email, password, callback) => {
	User.findOne({ email: email }).exec((err, user) => {
		if (err) {
			return callback(err);
		}
		else if (!user) {
			err = new Error('User not found.');
			err.status = 401;
			return callback(err);
		}

		bcrypt.compare(password, user.password, (err, result) => {
			if (result === true) {
				return callback(null, user);
			}

			return callback();
		});
	});
};

// change password
UserSchema.statics.changePassword = (userId, currentPassword, callback) => {
	User.findOne({ _id: userId }).exec((err, user) => {
		if (err) {
			return callback(err);
		}
		else if (!user) {
			err = new Error('User not found.');
			err.status = 401;
			return callback(err);
		}

		// check if current password matches input
		bcrypt.compare(currentPassword, user.password, (err, result) => {
			if (result === true) {
				return callback(null, user);
			}

			err = new Error('Current password not valid');
			err.status = 401;
			return callback(err);
		});
	});
};

// hash password before saving it to the db
UserSchema.pre('save', function(next) {
	let user = this;
	user.passwordConf = undefined;

	bcrypt.hash(user.password, 10, (err, hash) => {
		if (err) {
			return next(err);
		}

		user.password = hash;
		next();
	});
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
