var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');
var Order = require('../models/Order');

// create
router.post('/item/:id', (req, res, next) => {
	console.log(req.params);

	next({
		message: 'hello',
	});
});

router.post('/order', requiresLogin, (req, res, next) => {
	console.log(req.body);

	let orderData = {
		type: req.body.type,
		item: req.body.item,
		itemId: req.body.itemId,
		price: req.body.price,
		quantity: req.body.quantity,
		unusual: req.body.unusual,
		notes: req.body.notes,
		platform: req.body.platform,
		includeDiscord: req.body.includeDiscord,
		includeSteam: req.body.includeSteam,
		date: req.body.definedTimestamp || new Date(),
		addedBy: req.session.userId,
		addedByIP: req.ip,
	};

	Order.create(orderData, (err, order) => {
		if (err) {
			let errorMessage = 'Unknown Error';

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
			message: 'order-created',
		});
	});
});

const getOrder = (req, res, next, type) => {
	let perPage = 10;

	if (req.query.item === undefined) {
		return next({
			status: 400,
			message: 'No item ID was provided.',
		});
	}

	if (req.query.platform === undefined) {
		return next({
			status: 400,
			message: 'No platform was provided.',
		});
	}

	let page = req.query.page ? req.query.page - 1 : 0;
	page = (page > 1) ? 1 : page;

	Order.find({
		itemId: req.query.item,
		platform: req.query.platform,
		active: true,
		type,
	})
		.sort({ date: -1 })
		.skip(page * perPage)
		.limit(perPage)
		.select('unusual includeDiscord includeSteam price quantity notes platform date addedBy')
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

			return res.send(data);
		});
};

router.get('/orders/buy', (req, res, next) => {
	getOrder(req, res, next, 'buy');
});

router.get('/orders/sell', (req, res, next) => {
	getOrder(req, res, next, 'sell');
});

module.exports = router;
