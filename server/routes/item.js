var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');

var Item = require('../models/Item');

// create
router.post('/create', requiresLogin, (req, res, next) => {
	let itemData = {
		name: req.body.item,
		addedBy: req.session.userId,
	};

	Item.create(itemData, (err, user) => {
		if (err) {
			let errorMessage = 'Unknown Error';
			console.log(err);

			if (err.errors.itemName !== undefined) {
				errorMessage = 'This item already exists.';
			}

			return next({
				status: 401,
				message: {
					success: false,
					message: errorMessage,
				},
			});
		}

		return res.send({
			success: true,
			message: 'item-created',
			redirect: `/item/${itemData.name.replace(/\s/g, '_')}`,
		});
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
