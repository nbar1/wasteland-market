import Order from '../models/Order';
import Item from '../models/Item';

const getMedian = values => {
	values.sort((a, b) => a - b);

	var half = Math.floor(values.length / 2);

	if (values.length % 2) return values[half];

	return (values[half - 1] + values[half]) / 2.0;
};

const updatePrice = (itemId, platform) => {
	let ordersToCount = 1000;

	Order.find({
		itemId,
		platform,
		active: true,
	})
		.sort({ date: -1 })
		.limit(ordersToCount)
		.select('price')
		.exec((err, data) => {
			if (err) throw err;

			let prices = [];
			data.forEach(item => {
				prices.push(item.price);
			});

			// get change percent
			let changeDate = new Date();
			changeDate.setDate(changeDate.getDate() - 1);

			Order.find({
				itemId,
				platform,
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

					// store new price
					return {
						price,
						change,
					};
				});
		});
};

const doUpdate = () => {
	Item.find({ enabled: true })
		.select('_id')
		.exec((err, data) => {
			if (err) throw err;

			updatePrice(data._id, 'xbox');
			updatePrice(data._id, 'playstation');
			updatePrice(data._id, 'pc');
		});
};

export default doUpdate;
