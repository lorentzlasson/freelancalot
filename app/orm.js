var filesystem = require('fs'),
	models = {},
	relationships = {}

var singleton = function singleton() {
	var Sequelize = require('sequelize')
	var sequelize = null
	this.setup = function(database, username, password, obj) {
		if (arguments.length == 2) {
			sequelize = new Sequelize(database, username)
		} else if (arguments.length == 3) {
			sequelize = new Sequelize(database, username, password)
		} else if (arguments.length == 4) {
			sequelize = new Sequelize(database, username, password, obj)
		}
		init()
	}

	this.model = (name) => {
		return models[name]
	}

	this.Seq = () => {
		return Sequelize
	}

	var init = () => {
		var modelFiles = filesystem.readdirSync(__dirname + '/models')
		modelFiles.forEach((name) => {
			var object = require('./models/' + name)
			var options = object.options || {}
			var modelName = name.replace(/\.js$/i, '')
			models[modelName] = sequelize.define(modelName, object.model, options)
			if ('relations' in object) {
				relationships[modelName] = object.relations
			}
		})

		sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
		.then(() => {
			return sequelize.sync({
				force: true
			})
		})
		.then(() => {
			return sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
		})
		.then(() => {
			var User = singleton.getInstance().model('user')
			User.create({
				email: 'a@b.com',
				password: 'qwe'
			})
		})
		.then(() => {
			console.log('Database synchronised.')
		}, (err) => {
			console.log(err)
		})

		for (var name in relationships) {
			var relation = relationships[name]
			for (var relName in relation) {
				var related = relation[relName]
				if (typeof related === 'object') {
					models[name][relName](models[related[0]], related[1])
				} else {
					models[name][relName](models[related])
				}
			}
		}
	}

	if (singleton.caller != singleton.getInstance) {
		throw new Error('This object cannot be instantiated')
	}
}

singleton.instance = null

singleton.getInstance = function() {
	if (this.instance === null) {

		this.instance = new singleton()
	}
	return this.instance
}

module.exports = singleton.getInstance()
