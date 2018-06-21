var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');

var Item = require('../models/Item');

// create
router.post('/create', requiresLogin, (req, res, next) => {
	next({
		message: 'create',
	});
});

// item info
router.get('/:id', requiresLogin, (req, res, next) => {
	// check password integrity
	console.log(req.params);

	next({
		message: 'hello',
	});
});

module.exports = router;
