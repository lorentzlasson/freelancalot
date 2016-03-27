let debug = require('debug')('freelancalot')
let cfenv = require('cfenv')
let appEnv = cfenv.getAppEnv()

require('./database')
.then(() => {
	debug('database initialized')
	return require('./server')
})
.then(server => {
	server.listen(appEnv.port)
	debug('server running on %s', appEnv.url)
})
.catch(err => {
	debug('error during startup: ', err)
})
