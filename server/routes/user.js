var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');
var User = require('../models/User');

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
	};

	User.create(userData, (err, user) => {
		if (err) {
			let errorMessage = 'Unknown Error';
			if (err.code === 11000 && err.message.indexOf('email') > -1) {
				errorMessage = 'Email already registered.';
			}
			else if (err.code === 11000 && err.message.indexOf('username') > -1) {
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
		}

		return res.send('user created');
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
		}

		return res.send({
			user: {
				username: user.username,
				premium: user.premium,
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

// authStatus
router.get('/authStatus', requiresLogin, (req, res, next) => {
	return res.send({
		loggedIn: true,
		username: req.session.user.username,
		premium: req.session.user.premium,
	})
});

module.exports = router;
