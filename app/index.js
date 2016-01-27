var express = require('express'),
	app = express(),
	orm = require('./orm'),
	cfenv = require('cfenv'),
	appEnv = cfenv.getAppEnv(),
	auth = require('./auth'),
	bodyParser = require('body-parser')

app.use(bodyParser.json())

var dbService = appEnv.getService('myClearDB'),
	dbCreds = dbService.credentials

orm.setup(dbCreds.name, dbCreds.username, dbCreds.password, {
	host: dbCreds.hostname,
	dialect: 'mysql',
	port: dbCreds.port,
	pool: {
		max: 2
	}
})

app.use(auth.router)
app.use('/', express.static(__dirname + '/public'))
var v1router = require('./api/v1')
app.use('/api/v1/', auth.ensureAuthenticated, v1router)

module.exports = app
