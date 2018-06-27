var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');
var User = require('../models/User');
var Login = require('../models/Login');
var bcrypt = require('bcrypt');

// register
router.post('/register', (req, res, next) => {
	// check password integrity
	if (req.body.password !== req.body.passwordConf) {
		let err = new Error('Passwords do not match.');
		err.status = 400;

		res.send('passwords dont match');

		return next(err);
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
		};

		return res.send({
			success: true,
			message: 'user-created',
		});
	});
});

// login
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

// logout
router.get('/logout', (req, res, next) => {
	if (!req.session) return;

	req.session.destroy(err => {
		if (err) return next(err);

		return res.send('logout success');
	});
});

// change email
router.post('/change-email', (req, res, next) => {
	if (req.body.email === '' || req.body.email === undefined) {
		return next({
			status: 401,
			message: {
				success: false,
				message: 'You must provide an email address',
			},
		});
	}

	User.find({ email: req.body.email }, function(err, docs) {
		if (docs.length) {
			return next({
				status: 401,
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

// change password
router.post('/change-password', (req, res, next) => {
	// check password integrity
	if (req.body.newPassword !== req.body.newPasswordConf) {
		let err = new Error('Passwords do not match.');
		err.status = 400;

		res.send('passwords dont match');

		return next(err);
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

		let newPassword = req.body.newPassword;
		bcrypt.hash(newPassword, 10, (err, hash) => {
			if (err) {
				return next(err);
			}

			User.findOneAndUpdate(
				{ _id: req.session.userId },
				{ $set: { password: hash } },
				{ upsert: false },
				err => {
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
				}
			);
		});
	});
});

// update platforms
router.post('/update-platforms', (req, res, next) => {
	let platforms = {
		xbox: req.body.xbox || '',
		playstation: req.body.playstation || '',
		steam: req.body.steam || '',
	};

	User.findOneAndUpdate(
		{ _id: req.session.userId },
		{ $set: { platforms: platforms } },
		{ upsert: false },
		err => {
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
		}
	);
});

// authStatus
router.get('/authStatus', requiresLogin, (req, res, next) => {
	User.findOne({ _id: req.session.userId }, function(err, doc) {
		return res.send({
			loggedIn: true,
			username: doc.username,
			premium: doc.premium,
			platforms: doc.platforms,
		});
	});
});

module.exports = router;
