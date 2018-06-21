var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordConf: {
		type: String,
		required: true,
	},
	dateRegistered: {
		type: Date,
	},
	enabled: {
		type: Boolean,
		default: true,
		required: true,
	},
	premium: {
		type: Boolean,
		default: false,
		required: true,
	}
});

// authenticate input against database
UserSchema.statics.authenticate = (email, password, callback) => {
	User.findOne({ email: email })
		.exec((err, user) => {
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

// hash password before saving it to the db
UserSchema.pre('save', function(next) {
	let user = this;
	user.passwordConf = undefined;
	user.dateRegistered = new Date();

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