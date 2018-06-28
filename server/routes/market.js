var express = require('express');
var router = express.Router();

// create
router.post('/item/:id', (req, res, next) => {
	console.log(req.params);

	next({
		message: 'hello',
	});
});

router.post('/order', (req, res, next) => {
	console.log(req.params);

	next({
		message: 'hello',
	});
});

module.exports = router;
