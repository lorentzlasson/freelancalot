var cfenv = require('cfenv'),
	appEnv = cfenv.getAppEnv(),
	app = require('./app')

app.listen(appEnv.port)
console.log('Running on %s', appEnv.url)
