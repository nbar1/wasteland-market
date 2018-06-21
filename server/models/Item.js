var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
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
	}
});

// authenticate input against database
ItemSchema.statics.authenticate = (email, password, callback) => {
	Item.findOne({ email: email })
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
ItemSchema.pre('save', function(next) {
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

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
