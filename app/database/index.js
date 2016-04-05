const cfenv = require('cfenv')
const appEnv = cfenv.getAppEnv()
const fs = require('fs')
const Sequelize = require('sequelize')
const creds = appEnv.getServiceCreds('mysql-rob')

if(!creds)
	throw new Error('database credentials not found')

const options = {
	host: creds.hostname,
	dialect: 'mysql',
	port: creds.port,
	logging: false,
	pool: {
		max: 2
	}
}

const database = {
	model: {}
}

const sequelize = new Sequelize(creds.name, creds.username, creds.password, options)
const modelFiles = fs.readdirSync(__dirname)

modelFiles.forEach(name => {
	if(name === 'index.js')
		return

	const object = require('./' + name)
	const modelName = name.replace(/\.js$/i, '')
	database.model[modelName] = sequelize.define(modelName, object.model, object.options)
})

let initialized = false
const init = new Promise(resolve => {
	if(initialized)
		return resolve(database)

	sequelize.sync(
	{force: true}
	)
	.then(() => {
		initialized = true
		return resolve(database)
	})
})

module.exports = init
