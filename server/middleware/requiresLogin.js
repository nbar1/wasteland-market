function requiresLogin(req, res, next) {
	if (req.session && req.session.userId) {
		return next();
	}
	else {
		var err = new Error('You must be logged in to view this page.');
		err.status = 401;
		return next({
			status: 401,
			message: {
				success: false,
				token: 'not-authenticated',
			}
		});
	}
}

module.exports = requiresLogin;
