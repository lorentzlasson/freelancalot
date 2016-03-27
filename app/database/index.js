let cfenv = require('cfenv')
let appEnv = cfenv.getAppEnv()
let fs = require('fs')
let Sequelize = require('sequelize')
let creds = appEnv.getServiceCreds('myClearDB')

if(!creds)
	throw new Error('database credentials not found')

let options = {
	host: creds.hostname,
	dialect: 'mysql',
	port: creds.port,
	logging: false,
	pool: {
		max: 2
	}
}

let database = {
	model: {}
}

let sequelize = new Sequelize(creds.name, creds.username, creds.password, options)
let modelFiles = fs.readdirSync(__dirname)

modelFiles.forEach(name => {
	if(name === 'index.js')
		return

	let object = require('./' + name)
	let modelName = name.replace(/\.js$/i, '')
	database.model[modelName] = sequelize.define(modelName, object.model, object.options)
})

let initialized = false
let init = new Promise(resolve => {
	if(initialized)
		return resolve(database)

	sequelize.sync(
	{force: true}
	)
	.then(() => {
		return resolve(database)
	})
})

module.exports = init
