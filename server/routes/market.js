var express = require('express');
var router = express.Router();
var requiresLogin = require('../middleware/requiresLogin');
var Order = require('../models/Order');
var User = require('../models/User');
var Item = require('../models/Item');

router.post('/order', requiresLogin, (req, res, next) => {
	let orderData = {
		type: req.body.type,
		item: req.body.item,
		itemId: req.body.itemId,
		price: req.body.price,
		quantity: req.body.quantity,
		level: req.body.level,
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

const getUserById = userId => {
	return User.find({
		_id: userId,
	})
		.select('username platforms premium')
		.exec()
		.then(user => user[0].toObject())
		.catch(err => {
			return false;
		});
};

const getItemById = itemId => {
	return Item.find({
		_id: itemId,
		enabled: true,
	})
		.select('name linkName category')
		.exec()
		.then(item => item[0].toObject())
		.catch(err => {
			return false;
		});
};

const getOrders = (req, res, next, type) => {
	let perPage = 10;

	let page = req.query.page ? req.query.page - 1 : 0;
	page = page > 1 ? 1 : page;

	let orderQuery = {
		active: true,
		open: { $ne: false },
		type,
	};

	if (req.query.item) {
		orderQuery.itemId = req.query.item;
	}

	if (req.query.platform && req.query.platform !== 'all') {
		orderQuery.platform = req.query.platform;
	}

	if (req.query.user) {
		orderQuery.addedBy = req.query.user;
		perPage = 100;
	}

	Order.find(orderQuery)
		.sort({ date: -1 })
		.skip(page * perPage)
		.limit(perPage)
		.select('itemId unusual includeDiscord includeSteam price quantity notes platform date addedBy')
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

			if (data.length === 0) {
				return next({
					status: 400,
					message: 'no-orders',
				});
			}

			data.forEach((order, key) => {
				dataWithUserInfo.push(order.toObject());
				getUserById(order.addedBy, key).then(user => {
					dataWithUserInfo[key].user = user;
					getItemById(order.itemId, key).then(item => {
						dataWithUserInfo[key].item = item;

						processed++;
						if (processed === data.length) {
							return res.send(dataWithUserInfo);
						}
					});
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
	getOrders(req, res, next, 'buy');
});

router.get('/orders/sell', (req, res, next) => {
	getOrders(req, res, next, 'sell');
});

router.post('/orders/close', (req, res) => {
	let orderId = req.body.orderId;

	Order.findOneAndUpdate(
		{ _id: orderId, addedBy: req.session.userId },
		{ $set: { open: false, closedDatetime: new Date() } },
		{ upsert: false },
		err => {
			if (err) return res.status(400).send({ msg: 'Invalid order' });
			return res.send({ success: true });
		}
	);
});

router.get('/price', (req, res, next) => {
	let ordersToCount = 1000;

	let orderQuery = {
		itemId: req.query.item,
		active: true,
	};

	if (req.query.platform === undefined || req.query.platform === 'undefined') {
		req.query.platform = 'all';
	}

	if (req.query.platform !== 'all') {
		orderQuery.platform = req.query.platform;
	}

	Order.find(orderQuery)
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

			let changeQuery = {
				itemId: req.query.item,
				active: true,
				date: { $lte: changeDate.toISOString() },
			};

			if (req.query.platform !== 'all') {
				changeQuery.platform = req.query.platform;
			}

			Order.find(changeQuery)
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

router.get('/directory', (req, res, next) => {
	Item.find({ enabled: true })
		.select('category name linkName')
		.exec((err, data) => {
			if (err) {
				let errorMessage = 'Unknown Error';

				return next({
					status: 400,
					message: errorMessage,
				});
			}

			let categories = {};

			data.forEach(item => {
				if (categories[item.category] === undefined) {
					categories[item.category] = [];
				}

				categories[item.category].push({
					name: item.name,
					linkName: item.linkName,
				});
			});

			Object.keys(categories).forEach(category => {
				categories[category].sort((a, b) => {
					var textA = a.name.toUpperCase();
					var textB = b.name.toUpperCase();
					return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
			});

			res.send({
				categories,
			});
		});
});

module.exports = router;
