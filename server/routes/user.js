var express = require('express');
var router = express.Router();
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
		if (err) return next(err);

		req.session.userId = user._id;

		return res.send('user created');
	});
});

// login
router.post('/login', (req, res, next) => {
	console.log(req.body);
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

		return res.send('Login success');
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

module.exports = router;
