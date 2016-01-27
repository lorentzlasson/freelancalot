var express = require('express'),
	app = express(),
	auth = require('./auth'),
	bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use(auth.router)
app.use('/', express.static(__dirname + '/public'))
var v1router = require('./api/v1')
app.use('/api/v1/', auth.ensureAuthenticated, v1router)

module.exports = app
