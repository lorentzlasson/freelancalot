const Sequelize = require('sequelize')

const idea = {
	model: {
		name: Sequelize.STRING,
		summary: Sequelize.STRING
	},

	options: {
		freezeTableName: true
	},

	relations: [
		['belongsTo', 'hub'],
		['hasMany', 'pitch']
	]
}

module.exports = idea
