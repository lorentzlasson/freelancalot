const cfenv = require('cfenv')
const appEnv = cfenv.getAppEnv()
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const creds = appEnv.getServiceCreds('mysql-rob')

const MODEL_DIR = '/model'

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
const modelFiles = fs.readdirSync(path.join(__dirname, MODEL_DIR))
const relations = new Map()

// setup data model
modelFiles.forEach(name => {
	const modelPath = path.join(__dirname, MODEL_DIR, name)
	const object = require(modelPath)
	const modelName = name.replace(/\.js$/i, '')
	database.model[modelName] = sequelize.define(modelName, object.model, object.options)
	relations.set(modelName, object.relations)
})

// set up model relations
relations.forEach((modelRelations, modelName) => {
	const model = database.model[modelName]
	if(modelRelations){
		modelRelations.forEach(relation => {
			const relationType = relation[0]
			const targetName = relation[1]
			const throughOpts = relation[2] // needed only if 'belongsToMany' relation type
			const target = database.model[targetName]
			model[relationType](target, throughOpts)
		})
	}
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
