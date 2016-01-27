var express = require('express'),
	app = express()
var orm = require('./orm')
var cfenv = require('cfenv'),
	appEnv = cfenv.getAppEnv()
var auth = require('./auth')

var bodyParser = require('body-parser')
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
