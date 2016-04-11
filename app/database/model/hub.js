const Sequelize = require('sequelize')

const hub = {
	model: {
		name: Sequelize.STRING
	},

	options: {
		freezeTableName: true
	},

	relations: [
		['belongsToMany', 'user', {
			through: 'userHub'
		}],
		['hasMany', 'idea']
	]
}

module.exports = hub
