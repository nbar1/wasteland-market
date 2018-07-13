var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
require('dotenv').config();

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wasteland-market');
var db = mongoose.connection;

// handle mongo error
db.on('error', () => console.error('connection error:'));
db.once('open', () => {
	// we're connected
});

// static build
app.use(express.static(path.resolve('build')));
app.enable('trust proxy');

// use sessions for tracking logins
app.use(session({
	secret: process.env.MONGO_SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db,
	}),
}));

// Set up CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// user routes
var userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

// item routes
var itemRoutes = require('./routes/item');
app.use('/api/item', itemRoutes);

// market routes
var marketRoutes = require('./routes/market');
app.use('/api/market', marketRoutes);

// search routes
var searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);

// homepage
app.get('/*', function(req, res) {
	res.sendFile(path.resolve('build/index.html'));
});

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message);
});

// listen
const SERVER_PORT = process.env.SERVER_PORT || 8080;
app.listen(SERVER_PORT, () => {
	console.log(`Wasteland Market Server running on ${SERVER_PORT}`);
});
