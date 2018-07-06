var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');
var Order = require('../models/Order');
var User = require('../models/User');

router.post('/order', requiresLogin, (req, res, next) => {
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
				status: 400,
				message: errorMessage,
			});
		}

		return res.send({
			success: true,
			message: 'order-created',
		});
	});
});

const getUserById = user => {
	return User.find({
		_id: user,
	})
		.select('username platforms')
		.exec()
		.then(user => user[0].toObject())
		.catch(err => {
			return false;
		});
};

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
	page = page > 1 ? 1 : page;

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
					message: errorMessage,
				});
			}

			let dataWithUserInfo = [];
			let processed = 0;

			data.forEach((order, key) => {
				dataWithUserInfo.push(order.toObject());

				getUserById(order.addedBy, key).then(user => {
					dataWithUserInfo[key].user = user;

					processed++;
					if (processed === data.length) {
						return res.send(dataWithUserInfo);
					}
				});
			});
		});
};

const getMedian = values => {
	values.sort((a, b) => a - b);

	var half = Math.floor(values.length / 2);

	if (values.length % 2) return values[half];

	return (values[half - 1] + values[half]) / 2.0;
};

router.get('/orders/buy', (req, res, next) => {
	getOrder(req, res, next, 'buy');
});

router.get('/orders/sell', (req, res, next) => {
	getOrder(req, res, next, 'sell');
});

router.get('/price', (req, res, next) => {
	let ordersToCount = 1000;

	Order.find({
		itemId: req.query.item,
		platform: req.query.platform,
		active: true,
	})
		.sort({ date: -1 })
		.limit(ordersToCount)
		.select('price')
		.exec((err, data) => {
			if (err) {
				let errorMessage = 'Unknown Error';

				return next({
					status: 400,
					message: errorMessage,
				});
			}

			let prices = [];
			data.forEach(item => {
				prices.push(item.price);
			});

			// get change percent
			let changeDate = new Date();
			changeDate.setDate(changeDate.getDate() - 1);

			Order.find({
				itemId: req.query.item,
				platform: req.query.platform,
				active: true,
				date: { $lte: changeDate.toISOString() },
			})
				.sort({ date: -1 })
				.limit(ordersToCount)
				.select('price')
				.exec((err, data) => {
					let oldPrices = [];
					data.forEach(item => {
						oldPrices.push(item.price);
					});

					let price = Math.round(getMedian(prices)) || 0;
					let oldPrice = Math.round(getMedian(oldPrices)) || 0;
					let change = (((oldPrice - price) / oldPrice) * 100).toFixed(2);
					change = change - change * 2 || 0;

					return res.send({
						price,
						change,
					});
				});
		});
});

module.exports = router;
