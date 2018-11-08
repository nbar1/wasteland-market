var express = require('express');
var router = express.Router();
var Item = require('../models/Item');

// autocomplete
router.post('/autocomplete', (req, res, next) => {
	Item.find({ name: new RegExp(`^${req.body.query}`, 'i') })
		.limit(7)
		.select('name linkName')
		.exec((err, data) => {
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
				data,
			});
		});
});

module.exports = router;
