const cfenv = require('cfenv')
const appEnv = cfenv.getAppEnv()

require('./database')
.then(() => {
	console.log('database initialized')
	return require('./server')
})
.then(server => {
	server.listen(appEnv.port)
	console.log('server running on [%s]', appEnv.url)
})
.catch(err => {
	console.log('error during startup: ', err)
})
