var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');
var Item = require('../models/Item');

// create
router.post('/create', requiresLogin, (req, res, next) => {
	return next({
		status: 400,
		message: {
			success: false,
			message: 'Item additions disabled',
		},
	});

	/*
	let itemData = {
		name: req.body.item,
		linkName: req.body.item.replace(/\s+/g, '-').toLowerCase(),
		category: req.body.category,
		subcategory: req.body.subcategory || 'unknown',
		addedBy: req.session.userId,
		addedByIP: req.ip,
	};

	const validCategories = [
		'uncategorized',
		'ammunition',
		'resource',
		'weapon',
		'armor',
		'food',
		'drink',
		'chem',
		'clothing',
		'junk',
	];

	if (validCategories.indexOf(req.body.category) === -1) {
		return next({
			status: 400,
			message: {
				success: false,
				message: 'You have entered an invalid category.',
			},
		});
	}

	Item.create(itemData, (err, item) => {
		if (err) {
			let errorMessage = 'Unknown Error';

			console.log(err);

			if (err.errors.itemName !== undefined) {
				errorMessage = 'This item already exists.';
			}

			return next({
				status: 400,
				message: {
					success: false,
					message: errorMessage,
				},
			});
		}

		return res.send({
			success: true,
			message: 'item-created',
			redirect: `/market/${itemData.name.replace(/\s/g, '-').toLowerCase()}`,
		});
	});
	*/
});

// item info
router.get('/', (req, res, next) => {
	Item.find({ linkName: new RegExp(`^${req.query.name}`, 'i') })
		.select('name category linkName')
		.exec((err, data) => {
			if (err) {
				let errorMessage = 'Unknown Error';

				return next({
					status: 400,
					message: {
						success: false,
						message: errorMessage,
					},
				});
			}

			if (data.length === 0) {
				return next({
					status: 400,
					message: 'Item not found',
				});
			}

			return res.send(data[0]);
		});
});

module.exports = router;
