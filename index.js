var cfenv = require('cfenv'),
	appEnv = cfenv.getAppEnv(),
	app = require('./app'),
	orm = require('./app/orm')

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

app.listen(appEnv.port)
console.log('Running on %s', appEnv.url)
