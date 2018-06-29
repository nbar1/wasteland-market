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
		price: req.body.price,
		quantity: req.body.quantity,
		unusual: req.body.unusual,
		notes: req.body.notes,
		platform: req.body.platform,
		includeDiscord: req.body.includeDiscord,
		includeSteam: req.body.includeSteam,
		date: new Date(),
		addedBy: req.session.userId,
		addedByIP: req.ip,
	};

	Order.create(orderData, (err, order) => {
		console.log(order);
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

module.exports = router;
