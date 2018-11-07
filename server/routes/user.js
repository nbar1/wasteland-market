var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');
var User = require('../models/User');
var UserRating = require('../models/UserRating');
var Login = require('../models/Login');
var VerificationToken = require('../models/VerificationToken');
var PasswordResetToken = require('../models/PasswordResetToken');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var sendMail = require('../lib/email');

/**
 * Register
 */
router.post('/register', (req, res, next) => {
	// Validate email
	if (validateEmail(req.body.email) === false) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'You must use a valid email address',
			},
		});
	}

	// Verify username characters
	if (/^\w+$/.test(req.body.username) === false) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'Username can contain only letters and numbers',
			},
		});
	}

	// Verify username length
	if (req.body.username.length < 6) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'Your username must be at least 6 characters',
			},
		});
	}

	if (req.body.username.length > 32) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'Your username must be no longer than 32 characters',
			},
		});
	}

	// check password integrity
	if (req.body.password !== req.body.passwordConf) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'Passwords do not match',
			},
		});
	}

	if (req.body.password.length < 8) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'Your password must be at least 8 characters',
			},
		});
	}

	if (validateEmail(req.body.email) === false) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'You must use a valid email address',
			},
		});
	}

	if (req.body.username.length < 6) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'Your username must be at least 6 characters',
			},
		});
	}

	let userData = {
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		passwordConf: req.body.passwordConf,
		dateRegistered: new Date(),
		registrationIP: req.ip,
		platforms: {
			xbox: '',
			playstation: '',
			steam: '',
			bethesda: '',
			discord: '',
		},
	};

	User.create(userData, (err, user) => {
		if (err) {
			let errorMessage = 'Unknown Error';
			if (err.errors.email !== undefined) {
				errorMessage = 'Email already registered.';
			}
			else if (err.errors.username !== undefined) {
				errorMessage = 'Username is already taken.';
			}

			return next({
				status: 401,
				message: {
					success: false,
					message: errorMessage,
				},
			});
		}

		req.session.userId = user._id;
		req.session.user = {
			username: user.username,
			premium: user.premium,
			verified: false,
		};

		var token = new VerificationToken({
			_userId: user._id,
			token: crypto.randomBytes(16).toString('hex'),
		});

		token.save(err => {
			if (err) {
				return res.status(500).send({ msg: err.message });
			}

			let message = `
				Hello ${user.username},
				<br><br>
				Please verify your email address to activate your Wasteland Market account by clicking the link below.
				<br><br>
				<a href="https://wastelandmarket.com/account/verify/${token.token}">
					https://wastelandmarket.com/account/verify/${token.token}
				</a>
			`;

			sendMail(user.email, 'Verify Your Email - Wasteland Market', message, (err, data) => {
				if (err) {
					return next({
						status: 401,
						message: {
							success: false,
							message: 'Unable to send verification email. Please contact support.',
						},
					});
				}

				return res.send({
					success: true,
					message: 'user-created',
				});
			});
		});
	});
});

/**
 * Login
 */
router.post('/login', (req, res, next) => {
	User.authenticate(req.body.email, req.body.password, (err, user) => {
		if (err || !user) {
			return next({
				status: 401,
				message: {
					success: false,
					message: 'Wrong email or password',
				},
			});
		}

		req.session.userId = user._id;
		req.session.user = {
			username: user.username,
			premium: user.premium,
			platforms: user.platforms,
		};

		Login.create({
			userID: user._id,
			username: user.username,
			date: new Date(),
			ip: req.ip,
		});

		return res.send({
			user: {
				username: user.username,
				premium: user.premium,
				platforms: user.platforms,
			},
		});
	});
});

/**
 * Logout
 */
router.get('/logout', (req, res, next) => {
	if (!req.session) return;

	req.session.destroy(err => {
		if (err) return next(err);

		return res.send('logout success');
	});
});

/**
 * Change Email
 */
router.post('/change-email', (req, res, next) => {
	if (req.body.email === '' || req.body.email === undefined) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'You must provide an email address',
			},
		});
	}

	User.find({ email: req.body.email }, function(err, docs) {
		if (docs.length) {
			return next({
				status: 400,
				message: {
					success: false,
					message: `The email ${req.body.email} already exists`,
				},
			});
		}

		User.findOneAndUpdate(
			{ _id: req.session.userId },
			{ $set: { email: req.body.email } },
			{ upsert: false },
			err => {
				if (err) {
					return next({
						status: 401,
						message: {
							success: false,
							message: 'Unable to update email address in database',
						},
					});
				}

				return res.send({
					success: true,
					message: 'Your email address has been changed.',
				});
			}
		);
	});
});

/**
 * Change Password
 */
router.post('/change-password', (req, res, next) => {
	// check password integrity
	if (req.body.newPassword !== req.body.newPasswordConf) {
		let err = new Error('Passwords do not match.');
		return next({
			status: 400,
			message: {
				success: false,
				message: err.message || 'Unknown Error',
			},
		});
	}

	User.changePassword(req.session.userId, req.body.currentPassword, (err, user) => {
		if (err || !user) {
			return next({
				status: 401,
				message: {
					success: false,
					message: err.message || 'Unable to update password',
				},
			});
		}

		if (req.body.newPassword.length < 8) {
			return next({
				status: 400,
				message: {
					success: false,
					message: err.message || 'Your password must be at least 8 characters',
				},
			});
		}

		let newPassword = req.body.newPassword;
		bcrypt.hash(newPassword, 10, (err, hash) => {
			if (err) {
				return next(err);
			}

			User.findOneAndUpdate({ _id: req.session.userId }, { $set: { password: hash } }, { upsert: false }, err => {
				if (err) {
					return next({
						status: 401,
						message: {
							success: false,
							message: 'Unable to update password in database',
						},
					});
				}

				return res.send({
					success: true,
					message: 'Your password has been changed.',
				});
			});
		});
	});
});

/**
 * Password Reset - Request
 */
router.post('/reset-password', (req, res, next) => {
	if (!req.body.email) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'You must provide an email address',
			},
		});
	}

	User.find({ email: req.body.email }, function(err, docs) {
		if (docs.length) {
			let user = docs[0];
			var token = new PasswordResetToken({
				_userId: user._id,
				token: crypto.randomBytes(16).toString('hex'),
			});

			token.save(err => {
				if (err) {
					return res.status(500).send({ msg: err.message });
				}

				let message = `
					Hello ${user.username},
					<br><br>
					You have requested a password reset token.
					<br><br>
					If you did not authorize this request, you may ignore this email.
					<br><br>
					If you did authorize this request, please use the link below to reset your password. This link will expire in 24 hours.
					<br><br>
					<a href="https://wastelandmarket.com/account/reset-password/${token.token}">
						https://wastelandmarket.com/account/reset-password/${token.token}
					</a>
				`;

				sendMail(user.email, 'Reset Password - Wasteland Market', message, (err, data) => {
					if (err) {
						return next({
							status: 401,
							message: {
								success: false,
								message: 'Unable to send password reset email. Please contact support.',
							},
						});
					}

					return res.send({
						success: true,
						message: 'password-reset-token-success',
					});
				});
			});
		}
		else {
			// send email
			return res.send({
				success: true,
				message: 'password-reset-token-user-doesnt-exist',
			});
		}
	});
});

/**
 * Password Reset - Perform
 */
router.post('/reset-password/:token', (req, res, next) => {
	PasswordResetToken.findOne({ token: req.params.token }, function(err, token) {
		if (!token) {
			return next({
				status: 400,
				message: {
					success: false,
					message: 'Your password reset token is invalid.',
				},
			});
		}

		// check password integrity
		if (req.body.newPassword !== req.body.newPasswordConf) {
			let err = new Error('Passwords do not match.');
			return next({
				status: 400,
				message: {
					success: false,
					message: err.message || 'Unknown Error',
				},
			});
		}

		if (req.body.newPassword.length < 8) {
			return next({
				status: 400,
				message: {
					success: false,
					message: err.message || 'Your password must be at least 8 characters',
				},
			});
		}

		let newPassword = req.body.newPassword;
		bcrypt.hash(newPassword, 10, (err, hash) => {
			if (err) {
				return next(err);
			}

			User.findOneAndUpdate({ _id: token._userId }, { $set: { password: hash } }, { upsert: false }, err => {
				if (err) {
					return next({
						status: 401,
						message: {
							success: false,
							message: 'Unable to update password in database',
						},
					});
				}

				return res.send({
					success: true,
					message: 'Your password has been changed.',
				});
			});
		});
	});
});

/**
 * Profile
 */
router.get('/profile', (req, res, next) => {
	let username = req.query.username;

	if (username === undefined) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'No username given.',
			},
		});
	}

	User.find({ username: username }, function(err, docs) {
		if (docs.length === 0) {
			return next({
				status: 400,
				message: {
					success: false,
					message: 'User does not exist.',
				},
			});
		}

		let user = docs[0].toObject();

		UserRating.count({ userId: user._id }, (err, count) => {
			UserRating.count({ userId: user._id, ratedBy: req.session.userId }, (err, hasRated) => {
				return res.send({
					success: true,
					hasRated: !!hasRated,
					user: {
						id: user._id,
						platforms: user.platforms,
						premium: user.premium,
						rating: count,
					},
				});
			});
		});
	});
});

/**
 * Rate
 */
router.post('/rate', (req, res, next) => {
	let userToRate = req.body.userId;
	let ratingIncrement = req.body.rating;

	// default to +1 rating for now
	ratingIncrement = 1;

	if (
		userToRate === undefined ||
		userToRate === '' ||
		req.session.userId === undefined ||
		userToRate === req.session.userId
	) {
		return next({
			status: 401,
			message: {
				success: false,
				message: 'Unable to update rating in database',
			},
		});
	}

	UserRating.findOneAndUpdate(
		{ userId: userToRate, ratedBy: req.session.userId },
		{ $set: { rating: ratingIncrement, createdAt: Date.now() } },
		{ upsert: true },
		err => {
			if (err) {
				return next({
					status: 401,
					message: {
						success: false,
						message: 'Unable to update rating in database',
					},
				});
			}

			return res.send({
				success: true,
				message: 'rating-updated',
			});
		}
	);
});

/**
 * Update Platforms
 */
router.post('/update-platforms', (req, res, next) => {
	let platforms = {
		xbox: req.body.xbox || '',
		playstation: req.body.playstation || '',
		steam: req.body.steam || '',
		bethesda: req.body.bethesda || '',
		discord: req.body.discord || '',
	};

	User.findOneAndUpdate({ _id: req.session.userId }, { $set: { platforms: platforms } }, { upsert: false }, err => {
		if (err) {
			return next({
				status: 401,
				message: {
					success: false,
					message: 'Unable to update platforms in database',
				},
			});
		}

		return res.send({
			success: true,
			message: 'Your platforms have been updated.',
		});
	});
});

/**
 * Email Verification - Verify
 */
router.get('/verify/:token', (req, res, next) => {
	VerificationToken.findOne({ token: req.params.token }, function(err, token) {
		if (!token) {
			return res.status(500).send({ msg: 'Could not find token' });
		}

		// If we found a token, find a matching user
		User.findOneAndUpdate({ _id: token._userId }, { $set: { verified: true } }, { upsert: false }, err => {
			if (err) return res.status(400).send({ msg: 'User does not exist' });
			return res.send({ success: true });
		});
	});
});

/**
 * Email Verification - Resend
 */
router.get('/verify/resend', (req, res, next) => {
	User.findOne({ _id: req.session.userId }, function(err, user) {
		if (user.verified === true) {
			return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
		}

		var token = new VerificationToken({
			_userId: user._id,
			token: crypto.randomBytes(16).toString('hex'),
		});

		token.save(err => {
			if (err) {
				return res.status(500).send({ msg: err.message });
			}

			let message = `
				Hello ${user.username},
				<br><br>
				Please verify your email address to activate your Wasteland Market account by clicking the link below.
				<br><br>
				<a href="https://wastelandmarket.com/account/verify/${token.token}">
					https://wastelandmarket.com/account/verify/${token.token}
				</a>
			`;

			sendMail(user.email, 'Verify Your Email - Wasteland Market', message, (err, data) => {
				if (err) {
					return res.status(500).send({ msg: err.message });
				}

				return res.send({ tokenCreated: true });
			});
		});
	});
});

/**
 * Auth Status
 */
router.get('/authStatus', requiresLogin, (req, res, next) => {
	User.findOne({ _id: req.session.userId }, function(err, doc) {
		return res.send({
			loggedIn: true,
			username: doc.username,
			id: doc._id,
			premium: doc.premium,
			verified: doc.verified,
			platforms: doc.platforms,
			admin: doc.toObject().admin,
		});
	});
});

/**
 * validateEmail
 *
 * @param {string} email
 * @returns {bool}
 */
function validateEmail(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return true;
	}

	return false;
}

module.exports = router;
