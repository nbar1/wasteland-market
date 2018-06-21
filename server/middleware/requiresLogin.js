function requiresLogin(req, res, next) {
	if (req.session && req.session.userId) {
		return next();
	}
	else {
		return next({
			status: 401,
			message: {
				loggedIn: false,
			},
		});
	}
}

module.exports = requiresLogin;
